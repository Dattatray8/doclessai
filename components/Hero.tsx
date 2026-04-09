'use client'

import Link from "next/link";

export default function Hero() {

    return (
        <section className="hero" id="home">
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
            </div>
        </section>
    );
}
