import {NextRequest} from "next/server";
import connectDB from "@/lib/db";
import Feature from "@/models/feature.model";
import {generateEmbeddings} from "@/helpers/server/generateEmbeddings";
import {ensureQdrantReady} from "@/lib/qdrantInit";
import {upsertFeatureVector} from "@/lib/qdrantUpsert";
import App from "@/models/app.model";
import {encrypt} from "@/security/encryption";
import {generateAppKey, hashAppKey} from "@/security/appKey";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();
    const {owner, name, contactEmail, geminiKey, description, features: inputFeats} = await request.json();
    const stream = new ReadableStream({
        async start(controller) {
            const sendUpdate = (status: string | object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({status})}\n\n`));
            };
            try {
                await connectDB();
                sendUpdate("🔐 Encrypting Your Gemini Key...");
                const encryptedGeminiKey = encrypt(geminiKey);
                sendUpdate("🔑 Generating secure App Key...");
                const secureAppKey = generateAppKey();
                const hashSecureAppKey = await hashAppKey(secureAppKey);
                sendUpdate("🗄️ Creating Your Application...")
                const app = await App.create({
                    owner,
                    name,
                    contactEmail,
                    geminiKey: encryptedGeminiKey,
                    description,
                    appKey: hashSecureAppKey
                });
                const user = await User.findById(owner);
                if (!user) {
                    sendUpdate({error: "App owner not found."});
                    return controller.close();
                }
                user.apps.push(app._id);
                await user.save();
                const features = [];
                sendUpdate("🧩 Registering features...")
                for await (const feat of inputFeats) {
                    const feature = await Feature.create({...feat, appId: app?._id});
                    features.push(feature);
                }
                const featuresIds = [];
                for (const feature of features) {
                    featuresIds.push(feature.id);
                }
                app.features = featuresIds;
                await app.save();
                await ensureQdrantReady();
                sendUpdate("🧠 Indexing your app knowledge...");
                for await (const feat of features) {
                    const emb = await generateEmbeddings(feat.description);
                    await upsertFeatureVector({
                        featureId: feat?._id.toString(), embedding: emb, payload: {
                            appId: feat?.appId.toString(),
                            featureId: feat?._id.toString(),
                            name: feat?.name,
                        }
                    });
                }
                sendUpdate("⚡ Activating DoclessAI");
                sendUpdate({
                    success: true,
                    message: "App Created Successfully",
                    appKey: secureAppKey
                });
                controller.close();
            } catch (error) {
                console.log(error);
                sendUpdate({
                    success: false,
                    message: "Error in creating app",
                    error: error
                });
                controller.close();
            }
        }
    })
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}