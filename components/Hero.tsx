'use client'

import { Archivo_Black } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from "next/link";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
});

export default function Hero() {
    const router = useRouter();

    return (
        <section className="hero" id="home">
            <div className="hero-glow"></div>
            <div className="hero-content flex-col">
                <div className="hero-badge">Now on npm · @doclessai/sdk</div>
                <div className="hero-actions">
                    <Link href='/docs' className="btn-primary">Start Building</Link>
                    <Link href='https://github.com/Dattatray8/doclessai-sdk' className="btn-outline">View on GitHub</Link>
                </div>
            </div>
        </section>
    );
}
