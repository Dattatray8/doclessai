import mongoose from "mongoose";

interface IApp {
    _id?: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    name: string;
    contactEmail: string;
    geminiKey: {
        iv: string,
        content: string,
        tag: string,
    };
    appKey?: string;
    description: string;
    features?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const appSchema = new mongoose.Schema<IApp>({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    geminiKey: {
        iv: {type: String, required: true},
        content: {type: String, required: true},
        tag: {type: String, required: true},
        required: true,
        select: false,
    },
    description: {
        type: String,
        required: true,
    },
    appKey: {
        type: String,
        index: true,
        unique: true,
    },
    features: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feature"
        }
    ]
}, {timestamps: true});

const App = mongoose.models?.App || mongoose.model("App", appSchema);

export default App;