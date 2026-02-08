import {NextRequest, NextResponse} from "next/server";
import App from "@/models/app.model";
import {generateEmbeddings} from "@/helpers/server/generateEmbeddings";
import {searchSimilarFeatures} from "@/lib/qdrantSearch";
import Feature from "@/models/feature.model";
import {decrypt} from "@/security/encryption";
import {hashAppKey} from "@/security/appKey";
import {generateResponse} from "@/helpers/server/gemini";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const contentType = request.headers.get("content-type") || "";
        let appKey, query, imageFile;
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            appKey = formData.get("appKey") as string | null;
            query = formData.get("query") as string;
            imageFile = formData.get("image") as File | null;
        } else {
            const body = await request.json();
            appKey = body.appKey;
            query = body.query;
            imageFile = null;
        }
        if (!appKey) {
            return NextResponse.json({
                success: false, message: "app key missing"
            }, {status: 404});
        }
        const hashKey = hashAppKey(appKey);
        const app = await App.findOne({appKey: hashKey}).select("+geminiKey");
        if (!app) {
            return NextResponse.json({
                success: false, message: "App not found"
            }, {status: 404});
        }
        if (!query && !imageFile) {
            return NextResponse.json(
                {success: false, message: "Either query or image is required"},
                {status: 400}
            );
        }
        const emb = await generateEmbeddings(query);
        const result = await searchSimilarFeatures(emb!, app._id.toString());
        const featureIds = [];
        for (const r of result) {
            featureIds.push(r?.payload!.mongoFeatureId)
        }
        const features = [];
        for (const fId of featureIds) {
            const feature = await Feature.findById(fId);
            features.push(feature);
        }
        const geminiKey = decrypt(app.geminiKey);
        const res = await generateResponse(app, geminiKey, query, features, imageFile!);
        const sources = [];
        for (const f of features) {
            sources.push(f.image)
        }
        return NextResponse.json({...res, sources});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: `Internal server error for generating response`,
            },
            {status: 500}
        );
    }
}