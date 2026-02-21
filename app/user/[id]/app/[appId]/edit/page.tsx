'use client'

import toast from "react-hot-toast";
import axios from "axios";
import {useEffect, useState} from "react";
import {AppType, DEFAULT_FEATURES_JSON, Feature} from "@/types/global.types";
import {useSelector} from "react-redux";
import {user} from "@/types/redux.types";
import {useRouter} from "next/navigation";
import {Editor} from "@monaco-editor/react";

export default function EditApp({params}: { params: { appId: string } }) {
    const [app, setApp] = useState<AppType>();
    const {theme} = useSelector((state: user) => state.user);
    const router = useRouter();
    const [name, setName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [description, setDescription] = useState("");
    const [geminiKey, setGeminiKey] = useState("");
    const [featuresJson, setFeaturesJson] = useState(DEFAULT_FEATURES_JSON);
    const [featuresError, setFeaturesError] = useState<string | null>(null);
    const [parsedFeatures, setParsedFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (app) {
            setName(app.name || "");
            setContactEmail(app.contactEmail || "");
            setDescription(app.description || "");
            const feats = app?.features.map((item: Feature) => ({
                name: item.name,
                description: item.description,
                route: item.route,
                image: item.image,
                elementId: item.elementId
            }))
            setFeaturesJson(JSON.stringify(feats, null, 2));
        }
    }, [app]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(featuresJson);
            if (!Array.isArray(parsed)) {
                throw new Error("Root must be an array []");
            }

            parsed.forEach((f, i) => {
                if (!f.name || typeof f.name !== "string") {
                    throw new Error(`Feature[${i}].name is required`);
                }
                if (!f.description || typeof f.description !== "string") {
                    throw new Error(`Feature[${i}].description is required`);
                }
            });

            setParsedFeatures(parsed);
            setFeaturesError(null);
        } catch (err: any) {
            setParsedFeatures([]);
            setFeaturesError(err.message || "Invalid JSON format");
        }
    }, [featuresJson]);

    const canSubmit =
        name &&
        contactEmail &&
        description &&
        parsedFeatures.length > 0 &&
        !featuresError;

    const getParams = async (params) => {
        return await params;
    }

    const fetchApp = async () => {
        try {
            const resolvedParams = await getParams(params);
            const res = await axios.get(`/api/v1/app`, {params: {appId: resolvedParams.appId}, withCredentials: true});
            console.log(res.data);
            setApp(res.data.app);
        } catch (err: any) {
            console.error(err.response.data);
            toast.error(err?.response?.data?.message || "Failed to fetch app");
        }
    }

    useEffect(() => {
        fetchApp();
    }, [])

    const handleSaveApp = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("contactEmail", contactEmail);
            formData.append("description", description);
            if (geminiKey) {
                formData.append("geminiKey", geminiKey);
            }
            formData.append("features", featuresJson);
            const res = await axios.put(`/api/v1/app?appId=${app?._id}`, formData, {
                withCredentials: true
            });
            toast.success(res.data.message);
            router.push('/user');
        } catch (err: any) {
            setLoading(false);
            console.error(err.response.data);
            toast.error(err?.response?.data?.message || "Failed to save app");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            {app && (
                <div className="card-body">
                    <div className="text-2xl font-semibold">Edit your App</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="App name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            className="input w-full"
                            placeholder="Contact email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                    </div>

                    <textarea
                        rows={4}
                        className="textarea w-full mt-4"
                        placeholder="App description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="password"
                        className="input w-full mt-4"
                        placeholder="Gemini API Key"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                    />

                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-lg font-semibold">🧩 App Features (JSON)</div>
                            {!featuresError ? (
                                <span className="badge badge-success">Valid</span>
                            ) : (
                                <span className="badge badge-error">Invalid</span>
                            )}
                        </div>

                        <Editor
                            height="300px"
                            defaultLanguage="json"
                            value={featuresJson}
                            theme={theme === "dark" ? "vs-dark" : "vs-light"}
                            onChange={(v) => setFeaturesJson(v || "")}
                        />

                        {featuresError ? (
                            <div className="text-error text-sm mt-2">
                                ❌ {featuresError}
                            </div>
                        ) : (
                            <div className="text-success text-sm mt-2">
                                ✅ {parsedFeatures.length} features parsed
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary self-center mt-6"
                        onClick={handleSaveApp}
                        disabled={!canSubmit || loading}
                    >
                        {loading ? "Updating app..." : "Save App"}
                    </button>
                </div>
            )}
        </div>
    )
}