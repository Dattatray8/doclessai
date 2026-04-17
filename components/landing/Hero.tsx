'use client'

import Link from "next/link";

export default function Hero() {

    return (
        <section className="hero overflow-x-hidden" id="home">
            <div className="hero-glow"></div>
            <div className="hero-content flex-col">
                <div className="hero-badge">Now on npm · @doclessai/sdk</div>
                <h1 className="mb-5 font-bold leading-[1.08] tracking-[-1.5px] text-[clamp(36px,6vw,68px)]">DoclessAI <br />
                    <span className="bg-linear-to-br from-[#a29dff] via-[#6c63ff] via-45% to-[#4f8bf9] bg-clip-text text-transparent">Your app explains itself.</span>
                </h1>
                <p className="hero-sub">Embed a context-aware AI assistant with your app knowledge into any application. Users ask
                    questions — the AI will answer it.</p>
                <div className="hero-actions">
                    <Link href='/docs' className="btn-primary">Start Building</Link>
                    <Link href='https://github.com/Dattatray8/doclessai-sdk' className="btn-outline">View on GitHub</Link>
                </div>
                <div className="npm-tag">
                    <pre><code className="cmd">$ npm i @doclessai/sdk</code></pre>
                </div>
                <div className="mockup-code w-full" style={{ background: '#111520', border: '1px solid #111520' }}>
                    <span className="file-name">App.tsx</span>
                    <div className="code-body max-w-64 text-start">
                        <pre data-prefix="1"><code><span className="tk-kw">import</span> <span className="tk-kw">{"{"}</span> <span className="tk-fn">ChatWidget</span> <span className="tk-kw">{"}"}</span> <span className="tk-kw">from</span> <span className="tk-str">{"'@doclessai/sdk'"}</span></code></pre>
                        <pre data-prefix="2"><code></code></pre>
                        <pre data-prefix="3"><code><span className="tk-kw">export default function</span> <span className="tk-fn">App</span><span className="text-[#3b4460]">{"()"}</span><span className="tk-kw">{"\t{"}</span></code></pre>
                        <pre data-prefix="4"><code className="tk-kw">{"\treturn ("}</code></pre>
                        <pre data-prefix="5"><code className="tk-kw">{`\t\t<div>`}</code></pre>
                        <pre data-prefix="6"><code className="tk-cmt">{"\t\t\t{/* AI assistant — one JSX tag */}"}</code></pre>
                        <pre data-prefix="7"><code><span className="tk-kw">{"\t\t\t<ChatWidget"}</span><span className="tk-prop">{"appKey"}</span><span className="tk-kw">{"="}</span><span className="tk-str">{`"your-app-key"`}</span><span className="tk-prop">{" name"}</span><span className="tk-kw">=</span><span className="tk-str">{`"your-assistant-name"`}</span><span className="tk-kw">{" />"}</span></code></pre>
                        <pre data-prefix="8"><code className="tk-kw">{"\t\t</div>"}</code></pre>
                        <pre data-prefix="9"><code className="tk-kw">{"\t)"}</code></pre>
                        <pre data-prefix="10"><code className="tk-kw">{"}"}</code></pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
