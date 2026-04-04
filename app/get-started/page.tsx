'use client'

import { Archivo_Black } from "next/font/google";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const font = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
})

export default function GetStartedPage() {
    const [copied, setCopied] = useState<string>("");
    const copyToClipboard = async (text: string, arg: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(arg);
            setTimeout(() => setCopied(""), 2000);
        } catch (err) {
            toast.error("Failed to copy text");
            console.error("Failed to copy text: ", err);
        }
    };



    const dropInWidgetCode = `// Just import and drop it in ${"\n"}import { ChatWidget } from "@doclessai/sdk";\n\n<ChatWidget appKey="YOUR_KEY" name="YOUR_ASSISTANT_NAME" />`
    const installCmd = "npm i @doclessai/sdk";
    const headlessSdkCode = `// Use the client logic directly ${"\n"}import { DoclessClient } from "@doclessai/sdk";\n\nconst ai = new DoclessClient({appKey: "YOUR_KEY"});\n\nconst res = await ai.ask(userQuery);\n\nconst res = await ai.ask(userQuery, ImageFile);`

    return (
        <div className="flex flex-col gap-10 md:p-8 max-w-5xl mx-auto mb-20 text-base-content" id="docs">
            <div className="hero bg-base-200 rounded-3xl p-6 md:p-12 shadow-inner border border-base-300">
                <div className="hero-content flex-col lg:flex-row-reverse gap-8">
                    <div className="text-center lg:text-left">
                        <h1 className={`${font.className} text-4xl md:text-6xl text-primary leading-tight`}>
                            Ready to build?
                        </h1>
                        <p className="py-6 text-lg md:text-xl opacity-80">
                            Connect your application to DoclessAI.
                            Add a context-aware AI assistant using our drop-in widget or headless SDK.
                        </p>
                        <Link href="/user"
                            className="btn btn-primary btn-md md:btn-lg shadow-lg hover:scale-105 transition-transform">
                            Create Assistant
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <p className="text-sm opacity-60 mt-2">
                Works with React, Next.js, and plain HTML.
            </p>

            <section className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-4">
                    <span
                        className="bg-primary text-primary-content w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-base">1</span>
                    Install the SDK
                </h2>
                {/* Added bg-neutral and text-neutral-content to force visibility */}
                <div className="mockup-code bg-neutral text-neutral-content shadow-xl">
                    <span className="absolute top-3 right-3">
                        {copied === "installCmd" ? <Check className="w-6 h-6 text-success bg-success/10 rounded-full p-1" /> :
                            <Copy className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"
                                onClick={() => copyToClipboard(installCmd, "installCmd")} />}
                    </span>
                    <pre data-prefix="$" className="text-white"><code>npm i @doclessai/sdk</code></pre>
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-4">
                    <span
                        className="bg-primary text-primary-content w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-base">2</span>
                    Integrate your way
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="card bg-base-100 border-2 border-primary/30 shadow-xl relative overflow-hidden">
                        <div
                            className="absolute top-0 right-0 bg-primary text-primary-content px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-widest">
                            Recommended
                        </div>
                        <div className="card-body p-6">
                            <h3 className="card-title text-2xl mb-2">Drop-in Widget</h3>
                            <p className="text-sm opacity-70 mb-4">The fastest way to add AI. Handles UI, markdown formatting, image previews, auto-scrolling, and feature navigation.</p>

                            <div className="mockup-code bg-neutral text-white text-xs md:text-sm">
                                <span className="absolute top-3 right-3">
                                    {copied === "dropInWidgetCode" ? <Check className="w-6 h-6 text-success bg-success/10 rounded-full p-1" /> :
                                        <Copy className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"
                                            onClick={() => copyToClipboard(dropInWidgetCode, "dropInWidgetCode")} />}
                                </span>
                                <pre
                                    className="text-success italic"><code>{"// Just import and drop it in"}</code></pre>
                                <pre
                                    className="text-white"><code>import {"{ ChatWidget }"} from &quot;@doclessai/sdk&quot;;</code></pre>
                                <pre className="text-white"><code> </code></pre>
                                <pre
                                    className="text-white"><code>&lt;ChatWidget appKey=&quot;YOUR_KEY&quot; name=&quot;YOUR_ASSISTANT_NAME&quot; /&gt;</code></pre>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
                        <div className="card-body p-6">
                            <h3 className="card-title text-2xl text-secondary mb-2">Custom UI (Headless)</h3>
                            <p className="text-sm opacity-70 mb-4">Total freedom. Use our client logic to feed your own
                                custom-built chat interface.</p>

                            <div className="mockup-code bg-neutral text-white text-xs md:text-sm">
                                <span className="absolute top-3 right-3">
                                    {copied === "headlessSdkCode" ? <Check className="w-6 h-6 text-success bg-success/10 rounded-full p-1" /> :
                                        <Copy className="w-4 h-4 cursor-pointer opacity-80 hover:opacity-100"
                                            onClick={() => copyToClipboard(headlessSdkCode, "headlessSdkCode")} />}
                                </span>
                                <pre
                                    className="text-secondary italic"><code>{"// Use the client logic directly"}</code></pre>
                                <pre
                                    className="text-white"><code>import {"{ DoclessClient }"} from &quot;@doclessai/sdk&quot;;</code></pre>
                                <pre className="text-white"><code> </code></pre>
                                <pre className="text-white"><code>const ai = new DoclessClient({"{"} </code></pre>
                                <pre className="text-white"><code>{"\t"}appKey: &quot;YOUR_KEY&quot; </code></pre>
                                <pre className="text-white"><code>{"}"});</code></pre>
                                <pre className="text-white"><code> </code></pre>
                                <pre className="italic"><code>{"// Send only query"}</code></pre>
                                <pre className="text-white"><code>const res = await ai.ask(userQuery);</code></pre>
                                <pre className="italic"><code>{"// Send query with user Image"}</code></pre>
                                <pre className="text-white"><code>const res = await ai.ask(userQuery, ImageFile);</code></pre>
                                <br />
                                <pre className="italic"><code>{"// Response format"}</code></pre>
                                <pre className="text-white"><code>{"{"}</code></pre>
                                <pre className="text-white"><code>{"\t"}{"res: string,          // AI response"}</code></pre>
                                <pre className="text-white"><code>{"\t"}{"image: string|null,   // image URL if relevant"}</code></pre>
                                <pre className="text-white"><code>{"\t"}{"route: string|null,   // app route for navigation"}</code></pre>
                                <pre className="text-white"><code>{"\t"}{"elementId: string|null // UI element to highlight"}</code></pre>
                                <pre className="text-white"><code>{"}"}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-4">
                    <span className="bg-primary text-primary-content w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-base">3</span>
                    🎉 You&apos;re Live
                </h2>
                <p className="opacity-70">
                    Your assistant is ready to guide users, answer questions, and navigate features inside your app.
                </p>
            </section>

            <p className="text-center opacity-60 text-sm mt-6">
                Secure key handling • multimodal responses • context-aware navigation
            </p>
        </div>
    )
}