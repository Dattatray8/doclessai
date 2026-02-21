import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/db";
import Feature from "@/models/feature.model";
import {generateEmbeddings} from "@/helpers/server/generateEmbeddings";
import {ensureQdrantReady} from "@/lib/qdrantInit";
import {upsertFeatureVector} from "@/lib/qdrantUpsert";
import App from "@/models/app.model";
import {encrypt} from "@/security/encryption";
import {generateAppKey, hashAppKey} from "@/security/appKey";
import User from "@/models/user.model";
import {v4 as uuidv4} from "uuid";
import {qdrantClient} from "@/lib/qdrant";

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();
    const {owner, name, contactEmail, geminiKey, description, features: inputFeats} =
        await request.json();

    const stream = new ReadableStream({
        async start(controller) {
            const sendStatus = (message: string) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({type: "status", message})}\n\n`)
                );
            };
            const sendFinal = (payload: any) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({type: "final", ...payload})}\n\n`)
                );
            };
            const sendError = (message: string) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({type: "error", message})}\n\n`)
                );
            };
            try {
                await connectDB();
                sendStatus("🔐 Encrypting Your Gemini Key...");
                const encryptedGeminiKey = encrypt(geminiKey);
                sendStatus("🔑 Generating secure App Key...");
                const secureAppKey = generateAppKey();
                const hashSecureAppKey = hashAppKey(secureAppKey);
                sendStatus("🗄️ Creating Your Application...");
                const app = await App.create({
                    owner,
                    name,
                    contactEmail,
                    geminiKey: encryptedGeminiKey,
                    description,
                    appKey: hashSecureAppKey,
                });
                const user = await User.findById(owner);
                if (!user) {
                    sendError("App owner not found");
                    return controller.close();
                }
                user.apps.push(app._id);
                await user.save();
                sendStatus("🧩 Registering features...");
                const features = [];
                for (const feat of inputFeats) {
                    const feature = await Feature.create({...feat, appId: app._id});
                    features.push(feature);
                }
                app.features = features.map((f) => f._id);
                await app.save();
                await ensureQdrantReady();
                sendStatus("🧠 Indexing your app knowledge...");
                for (const feat of features) {
                    const emb = await generateEmbeddings(feat.description);
                    const qdrantPointId = uuidv4();
                    await upsertFeatureVector({
                        pointId: qdrantPointId,
                        embedding: emb!,
                        payload: {
                            appId: feat.appId.toString(),
                            mongoFeatureId: feat._id.toString(),
                            name: feat.name,
                            route: feat.route,
                        },
                    });
                }
                sendStatus("⚡ Activating DoclessAI...");
                sendFinal({
                    success: true,
                    message: "App Created Successfully",
                    appKey: secureAppKey,
                });
                controller.close();
            } catch (error) {
                console.error(error);
                sendError("❌ Failed to create app. Check server logs.");

                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const appId = searchParams.get("appId");

        if (appId) {
            const app = await App.findById(appId)
                .populate("features")
                .select("name description features contactEmail owner");

            if (!app) {
                return NextResponse.json({success: false, message: "App not found."}, {status: 404});
            }
            return NextResponse.json({success: true, app}, {status: 200});
        }

        if (userId) {
            const apps = await App.find({owner: userId}).select("name description features contactEmail");
            return NextResponse.json({success: true, apps}, {status: 200});
        }

        return NextResponse.json(
            {success: false, message: "Provide either userId or appId"},
            {status: 400}
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {success: false, message: "Internal server error"},
            {status: 500}
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const {searchParams} = new URL(request.url);
        const appId = searchParams.get("appId");
        const app = await App.findById(appId);
        if (!app) {
            return NextResponse.json({success: false, message: "App not found"});
        }
        const user = await User.findById(app.owner);
        if (!user) {
            return NextResponse.json({success: false, message: "App owner not found"});
        }
        await Feature.deleteMany({_id: {$in: app.features}});
        await qdrantClient.delete(process.env.QDRANT_COLLECTION!, {
            filter: {
                must: [{key: "appId", match: {value: appId?.toString()}}]
            }
        })
        user.apps.pull(app._id);
        await user.save();
        await App.findByIdAndDelete(app._id);
        return NextResponse.json({success: true, message: "App deleted successfully."});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: `Internal server error for deleting app`,
            },
            {status: 500}
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const formData = await request.formData();
        const {searchParams} = new URL(request.url);
        const appId = searchParams.get("appId");

        if (!appId) {
            return NextResponse.json({success: false, message: "appId is required"}, {status: 400});
        }

        const app = await App.findById(appId);
        if (!app) {
            return NextResponse.json({success: false, message: "App not found"}, {status: 404});
        }

        const name = formData.get("name")?.toString() || app.name;
        const description = formData.get("description")?.toString() || app.description;
        const contactEmail = formData.get("contactEmail")?.toString() || app.contactEmail;

        let encryptedGeminiKey = app.geminiKey;
        const newGeminiKey = formData.get("geminiKey")?.toString();
        if (newGeminiKey && newGeminiKey !== "undefined") {
            encryptedGeminiKey = encrypt(newGeminiKey);
        }

        await Feature.deleteMany({appId: app._id});
        await qdrantClient.delete(process.env.QDRANT_COLLECTION!, {
            filter: {
                must: [{key: "appId", match: {value: appId.toString()}}]
            }
        });

        const featuresJson = formData.get("features")?.toString();
        const inputFeats = featuresJson ? JSON.parse(featuresJson) : [];
        const newFeatureIds = [];

        for (const feat of inputFeats) {
            const feature = await Feature.create({
                ...feat, appId: app._id,
            });
            newFeatureIds.push(feature._id);

            const emb = await generateEmbeddings(feat.description);
            const qdrantPointId = uuidv4();
            await upsertFeatureVector({
                pointId: qdrantPointId,
                embedding: emb!,
                payload: {
                    appId: app._id.toString(),
                    mongoFeatureId: feature._id.toString(),
                    name: feature.name,
                    route: feature.route,
                },
            });
        }

        await App.findByIdAndUpdate(
            app._id,
            {
                name,
                description,
                contactEmail,
                geminiKey: encryptedGeminiKey,
                features: newFeatureIds,
            },
            {new: true}
        );

        return NextResponse.json({
            success: true,
            message: "App and features updated and re-indexed successfully"
        });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error for updating app",
            },
            {status: 500}
        );
    }
}