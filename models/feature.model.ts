import mongoose from "mongoose";

interface IFeature {
    _id?: mongoose.Types.ObjectId;
    name: string;
    appId: mongoose.Types.ObjectId;
    description: string;
    route?: string;
    elementId?: string;
    image?: string;
}

const featureSchema = new mongoose.Schema<IFeature>({
    name: {
        type: String,
        required: true,
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "App",
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    route: {
        type: String,
    },
    elementId: {
        type: String,
    },
    image: {
        type: String,
    },
}, {timestamps: true});

const Feature = mongoose.models?.Feature || mongoose.model("Feature", featureSchema);
export default Feature;