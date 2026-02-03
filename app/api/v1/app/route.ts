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

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const {owner, name, contactEmail, geminiKey, description, features: inputFeats} = await request.json();
        const encryptedGeminiKey = encrypt(geminiKey);
        const secureAppKey = generateAppKey();
        const hashSecureAppKey = await hashAppKey(secureAppKey);
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
            return NextResponse.json(
                {
                    success: false,
                    message: "App ownser not found.",
                },
                {status: 404},
            );
        }
        user.apps.push(app._id);
        await user.save();
        const features = [];
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
        return NextResponse.json(
            {
                success: true,
                message: "App Created Successfully",
                appKey: secureAppKey,
            }, {status: 201}
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error in creating app",
                error,
            },
            {status: 500},
        );
    }
}