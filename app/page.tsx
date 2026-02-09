'use client'

import {Archivo_Black} from "next/font/google";
import {useRouter} from "next/navigation";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
})

export default function Home() {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center items-center mt-30 gap-8">
            <div className="flex flex-col items-center gap-6">
                <div
                    className={`${appNameFont.className} text-5xl sm:text-7xl drop-shadow-sm drop-shadow-base-content`}>DoclessAI
                </div>
                <p className="font-bold text-lg sm:text-2xl">AI guidance for your application.</p>
            </div>
            <div className="flex gap-8">
                <button className="btn btn-outline sm:w-40 shadow-2xs shadow-base-content">Live Demo</button>
                <button className="btn btn-primary sm:w-40 shadow-2xs shadow-base-content"
                        onClick={() => router.push('/get-started')}>Get Started
                </button>
            </div>
        </div>
    );
}
