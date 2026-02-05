import {NextRequest, NextResponse} from "next/server";
import App from "@/models/app.model";
import {generateEmbeddings} from "@/helpers/server/generateEmbeddings";
import {searchSimilarFeatures} from "@/lib/qdrantSearch";
import Feature from "@/models/feature.model";
import {decrypt} from "@/security/encryption";
import {hashAppKey} from "@/security/appKey";
import {generateReponse} from "@/helpers/server/gemini";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const {appKey, query} = await request.json();
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
        if (!query) {
            return NextResponse.json({
                success: false, message: "Query key missing"
            }, {status: 404});
        }
        const emb = await generateEmbeddings(query);
        const result = await searchSimilarFeatures(emb, app._id.toString());
        const featureIds = [];
        for (const r of result) {
            featureIds.push(r?.payload.mongoFeatureId)
        }
        const features = [];
        for (const fId of featureIds) {
            const feature = await Feature.findById(fId);
            features.push(feature);
        }
        const geminiKey = decrypt(app.geminiKey);
        const res = await generateReponse(app, geminiKey, query, features);
        return NextResponse.json(res);
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