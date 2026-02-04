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
                        embedding: emb,
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
            } catch (error: any) {
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
        if (!userId) {
            return NextResponse.json(
                {success: false, message: "userId is required"},
                {status: 400}
            );
        }
        const user = await User.findById(userId).populate("apps");
        if (!user) {
            return NextResponse.json({success: false, message: "No user found."}, {status: 404});
        }
        return NextResponse.json({success: true, apps: user.apps}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: `Internal server error for fetching apps`,
            },
            {status: 500}
        );
    }
}