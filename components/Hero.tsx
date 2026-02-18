'use client'

import { Archivo_Black } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
});

export default function Hero() {
    const router = useRouter();

    return (
        <section className="relative flex items-center justify-center min-h-[70vh] px-6 overflow-hidden">

            <div className="absolute inset-0 -z-10 flex justify-center">
                <div className="w-125 bg-linear-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-20 blur-3xl rounded-full" />
            </div>

            <div className="flex flex-col items-center text-center gap-8">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`${appNameFont.className} text-5xl sm:text-7xl tracking-tight drop-shadow-xl`}
                >
                    DoclessAI
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="font-bold text-lg sm:text-2xl max-w-2xl leading-tight"
                >
                    Add an AI Assistant That Explains Your App
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex gap-6"
                >
                    <button
                        onClick={() => router.push('/get-started')}
                        className="px-8 py-2 border hover:shadow-primary/40 border-primary font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                        Get Started Free
                    </button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="text-sm max-w-xl opacity-80"
                >
                    DoclessAI provides instant contextual help inside your application —
                    reducing support load and improving user experience.
                </motion.p>

            </div>
        </section>
    );
}
