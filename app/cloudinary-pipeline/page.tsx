'use client'

import { useRef, useState } from "react";
import { cloudinaryPipeline } from "@/helpers/server/cloudinary";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CloudinaryPipelinePage() {
    const [cloudName, setCloudName] = useState<string>('');
    const [apiKey, setApiKey] = useState<string>('');
    const [apiSecret, setApiSecret] = useState<string>('');
    const [frontendImage, setFrontendImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [backendImage, setBackendImage] = useState<File | null>();
    const imageRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string>('');
    const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
    const [uploadHistory, setUploadHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) {
            return
        }
        setBackendImage(files[0])
        setFrontendImage(URL.createObjectURL(files[0]))
        setFileMeta({ name: files[0].name, size: (files[0].size / 1024 / 1024).toFixed(2) + " MB" })
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err: any) {
            toast.error("Failed to copy text: ");
            console.error("Failed to copy text: ", err);
        }
    };

    const handleConfigure = async () => {

        if (!cloudName || !apiKey || !apiSecret) {
            toast.error("Please fill in all Cloudinary credentials");
            return;
        }

        if (!backendImage) {
            toast.error("Please select an image");
            return;
        }
        setLoading(true)
        const res = await cloudinaryPipeline(
            cloudName,
            apiKey,
            apiSecret,
            backendImage
        );
        if (!res?.success) {
            toast.error(res?.message || "Something went wrong");
            setLoading(false)
            return;
        }

        setUrl(res.url)
        setImagePreview(frontendImage)
        setBackendImage(null)
        setUploadHistory((prev) => [res.url, ...prev])
        setLoading(false)
    }

    return (
        <div className="page">
            <div className="page-header">
                <div className="breadcrumb">
                    <Link href="/user">Dashboard</Link>
                    <span>›</span>
                    <span className="text-(--text)">Cloudinary Pipeline</span>
                </div>
                <div className="page-title">🖼 Image Hosting</div>
                <div className="page-sub">
                    Upload images and get public URLs to use in your feature definitions.
                    The AI can then return these images when users ask about relevant
                    features.
                </div>
            </div>

            <div className="callout callout-info mb-5">
                <span className="callout-icon">ℹ️</span>
                <p>
                    <strong>Why this exists:</strong> Feature images must be publicly
                    accessible URLs. This pipeline lets you upload images directly to
                    Cloudinary without leaving DoclessAI — no separate image hosting setup
                    needed. You need a free <Link
                        href="https://cloudinary.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--accent)"
                    >Cloudinary account ↗</Link>
                </p>
            </div>

            <div className="cloudinary-pipeline-cred-card">
                <div className="cloudinary-pipeline-card-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Cloudinary Credentials
                </div>

                <div className="cloudinary-pipeline-cred-grid">
                    <div className="cloudinary-pipeline-input-group">
                        <label className="cloudinary-pipeline-input-label">Cloud Name</label>
                        <input
                            className="cloudinary-pipeline-field-input"
                            type="text"
                            placeholder="my-cloud-name"
                            value={cloudName}
                            onChange={(e) => setCloudName(e.target.value)}
                            id="cloudName"
                        />
                    </div>

                    <div className="cloudinary-pipeline-input-group">
                        <label className="cloudinary-pipeline-input-label">API Key</label>
                        <input
                            className="cloudinary-pipeline-field-input mono"
                            type="text"
                            placeholder="123456789012345"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            id="apiKey"
                        />
                    </div>

                    <div className="cloudinary-pipeline-input-group">
                        <label className="cloudinary-pipeline-input-label">API Secret</label>
                        <input
                            className="cloudinary-pipeline-field-input mono"
                            type="password"
                            placeholder="••••••••••••••••••••"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            id="apiSecret"
                        />
                    </div>
                </div>

                <div className="cloudinary-pipeline-callout cloudinary-pipeline-callout-warn mt-3! mb-0!">
                    <span className="cloudinary-pipeline-callout-icon">⚠️</span>
                    <p>
                        <strong>Your credentials are not stored.</strong> They are used only to
                        authenticate this upload and are never persisted. Find them in
                        your Cloudinary dashboard.
                    </p>
                </div>
            </div>

            <div className="cloudinary-pipeline-upload-card">
                <div className="cloudinary-pipeline-card-label">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Upload Image
                </div>
                <div className="cloudinary-pipeline-upload-zone" onClick={() => imageRef.current?.click()}>
                    <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImage} />
                    {!frontendImage && (
                        <div className="cloudinary-pipeline-upload-placeholder">
                            <div className="cloudinary-pipeline-upload-icon-wrap">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <polyline points="16 16 12 12 8 16" />
                                    <line x1="12" y1="12" x2="12" y2="21" />
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                </svg>
                            </div>
                            <div className="cloudinary-pipeline-upload-title">Drop image here or click to browse</div>
                            <div className="cloudinary-pipeline-upload-hint">
                                Drag and drop any screenshot, diagram, or feature image
                            </div>
                            <div className="text-[11px] text-(--muted)">Max 10MB</div>
                        </div>
                    )}
                    {frontendImage && (
                        <>
                            <div className="cloudinary-pipeline-preview-overlay">
                                <div className="cloudinary-pipeline-preview-change">Click to change image</div>
                            </div>
                            <Image src={frontendImage} className="w-fit max-h-70" alt="User image" width={100} height={100} />
                        </>
                    )}

                </div>
                <div className="cloudinary-pipeline-upload-action-row">
                    <div className="cloudinary-pipeline-file-info" id="fileInfo">
                        <span className="text-sm text-(--muted)">{fileMeta ? `${fileMeta.name} (${fileMeta.size})` : "No file selected"}</span>
                    </div>
                    <button
                        className="btn-primary"
                        id="uploadBtn"
                        onClick={handleConfigure}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="16 16 12 12 8 16" />
                                    <line x1="12" y1="12" x2="12" y2="21" />
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                </svg>
                                Get Image URL
                            </>
                        )}
                    </button>
                </div>
            </div>

            {url && (
                <div className="cloudinary-pipeline-upload-card">
                    <div className="flex items-center mb-4 gap-2.5">
                        <div className="cloudinary-pipeline-card-label mb-0">Image Uploaded</div>
                        <span className="badge badge-success badge-outline rounded-full text-[7px] sm:text-sm">✓ Public URL ready</span>
                    </div>
                    <div className="cloudinary-pipeline-result-label">
                        Public URL — paste this into your feature&apos;s
                        <code className="inline">image</code> field
                    </div>
                    <div className={"cloudinary-pipeline-field-input w-full flex justify-between"}>
                        <p className={"truncate max-w-56 sm:max-w-full text-(--accent)"}>{url}</p>
                        <Copy className={"w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"}
                            onClick={() => copyToClipboard(url)} />
                    </div>
                    <Image src={imagePreview} className="w-full object-cover mt-4 rounded-xl max-h-70" alt="User image" width={100} height={100} />
                    <div className="mt-3 text-[12.5px] text-(--muted2)">
                        Now paste this URL into the <code className="inline">image</code> field of
                        your feature in the
                        <Link
                            href={"/create-app"}
                            className="text-(--accent)"> Create App </Link>
                        form or edit your existing app.
                    </div>
                </div>
            )}

            <div className="cloudinary-pipeline-upload-card">
                <div className="cloudinary-pipeline-card-label mb-4">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Upload History (this session)
                </div>
                {uploadHistory.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {uploadHistory.map((url, idx) => (
                            <div className={"cloudinary-pipeline-field-input w-full flex justify-between"} key={idx}>
                                <p className={"truncate max-w-44 sm:max-w-full text-(--accent)"}>{url}</p>
                                <Copy className={"w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"}
                                    onClick={() => copyToClipboard(url)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-(--muted) p-8">
                        No uploads yet this session. Upload an image above to get started.
                    </div>
                )}
            </div>
        </div>
    )
}