'use client'

import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { user } from "@/types/redux.types";
import { useRouter } from "next/navigation";
import { DEFAULT_FEATURES_JSON } from "@/types/global.types";
import Link from "next/link";

export default function CreateApp() {
    const data = useSelector((state: user) => state.user);
    const router = useRouter();
    const [name, setName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [description, setDescription] = useState("");
    const [geminiKey, setGeminiKey] = useState("");

    const [featuresJson, setFeaturesJson] = useState(DEFAULT_FEATURES_JSON);
    const [featuresError, setFeaturesError] = useState<string | null>(null);
    const [parsedFeatures, setParsedFeatures] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [finalResult, setFinalResult] = useState<any>(null);

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
        geminiKey &&
        parsedFeatures.length > 0 &&
        !featuresError;

    const handleSubmit = async () => {
        if (!canSubmit) {
            toast.error("Fill all fields correctly");
            return;
        }

        setLoading(true);
        setProgressLogs([]);
        setFinalResult(null);

        // Open progress modal
        (document.getElementById("progress_modal") as HTMLDialogElement)?.showModal();

        try {
            const res = await fetch("/api/v1/app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    description,
                    geminiKey,
                    contactEmail,
                    features: parsedFeatures,
                    owner: data?.userData._id,
                }),
            });

            if (!res.body) throw new Error("No response stream");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() || "";
                for (const part of parts) {
                    if (!part.startsWith("data:")) continue;
                    const jsonStr = part.replace("data:", "").trim();
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.type === "status") {
                        setProgressLogs((prev) => [...prev, parsed.message]);
                    }
                    if (parsed.type === "final") {
                        setFinalResult(parsed);
                    }
                    if (parsed.type === "error") {
                        toast.error(parsed.message);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create app");
        } finally {
            setLoading(false);
            (document.getElementById("progress_modal") as HTMLDialogElement)?.close();
        }
    };

    useEffect(() => {
        if (finalResult?.appKey) {
            (document.getElementById("success_modal") as HTMLDialogElement)?.showModal();
        }
    }, [finalResult]);

    return (
        <div className="create-app-card">
            <div className="create-app-page-header">
                <div className="create-app-breadcrumb">
                    <Link href="/user">Dashboard</Link>
                    <span>›</span>
                    <span className="text-(--text)">Create App</span>
                </div>
                <div className="create-app-title">Create a new app</div>
                <div className="create-app-sub">
                    Your app&apos;s features teach the AI what your application does. Users
                    will chat with the assistant to get answers about these features.
                </div>
            </div>
            <dialog id="progress_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">
                        🚀 Creating your application...
                    </h3>

                    <ul className="space-y-1 text-sm font-mono max-h-60 overflow-auto">
                        {progressLogs.map((log, i) => (
                            <li key={i} className="opacity-80">
                                {log}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span className="text-sm opacity-70">Processing...</span>
                    </div>

                    <p className="text-xs opacity-50 mt-3">
                        Please don’t close this window.
                    </p>
                </div>
            </dialog>

            <dialog id="success_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        🎉 App Created Successfully!
                    </h3>

                    <p className="mt-2 text-sm opacity-80">
                        This is your <b>App Key</b>. Copy it now — you won’t be able to see it again.
                    </p>

                    <div className="mt-3 p-3 bg-black text-green-400 font-mono rounded break-all">
                        {finalResult?.appKey}
                    </div>

                    <button
                        className="btn btn-sm btn-outline mt-3"
                        onClick={() => {
                            navigator.clipboard.writeText(finalResult?.appKey || "");
                            toast.success("App key copied!");
                        }}
                    >
                        Copy App Key
                    </button>

                    <div className="alert alert-warning mt-4 text-sm">
                        ⚠️ Store this key securely.
                    </div>

                    <div className="mt-4">
                        <button
                            className="btn btn-primary w-full"
                            onClick={() => {
                                (document.getElementById("success_modal") as HTMLDialogElement)?.close();
                                router.push("/user");
                            }}
                        >
                            Done
                        </button>
                    </div>

                </div>
            </dialog>

            <div className="create-app-form-card" id="create-app">
                <div className="create-app-section-label">App Details</div>
                <div className="create-app-input-row">
                    <div className="create-app-input-group">
                        <label className="create-app-input-label">App Name <span className="req">*</span></label>
                        <input
                            type="text"
                            className="create-app-field-input"
                            placeholder="My SaaS App"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="create-app-input-group">
                        <label className="create-app-input-label">Contact email <span className="req">*</span></label>
                        <input
                            type="email"
                            className="create-app-field-input"
                            placeholder="you@example.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="create-app-input-group mb-3">
                    <label className="create-app-input-label">App Description <span className="req">*</span></label>
                    <textarea
                        rows={4}
                        className="create-app-field-textarea create-app-field-input"
                        placeholder="Describe what your app does overall — this helps the AI understand the context of all features."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="create-app-input-group">
                    <label className="create-app-input-label"
                    >Gemini API Key <span className="req">*</span></label
                    >
                    <input
                        type="password"
                        className="create-app-field-input mono"
                        placeholder="AIza••••••••••••••••••••••••••••••••••••••"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                    />
                    <div className="create-app-hint">
                        Your Gemini API key powers the AI responses for this app. Get one at
                        <Link
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            className="text-(--accent)"
                        > aistudio.google.com ↗</Link>
                    </div>
                </div>

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
                        theme={"vs-dark"}
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
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                >
                    {loading ? "Creating..." : "Create App"}
                </button>
            </div>
        </div>
    );
}
