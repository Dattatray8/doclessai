'use client';

import { Menu, X } from "lucide-react";
import { Archivo_Black, Sora } from "next/font/google";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChatWidget } from "@doclessai/sdk";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
});

const tabFont = Sora({
    subsets: ['latin'],
    weight: ['500']
})

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="relative">
            <nav className="nav-wrap">
                <div className="nav-inner">
                    <div className="flex items-center ">
                        <Link href={'/'} className={`${appNameFont.className} text-2xl`}>DoclessAI</Link>
                    </div>
                    <ul className="nav-links md:flex hidden">
                        <li><Link href="#features" className={tabFont.className}>Features</Link></li>
                        <li><Link href="/docs" className={tabFont.className}>Docs</Link></li>
                        <li>
                            <Link
                                href="https://github.com/Dattatray8/doclessai-sdk"
                                target="_blank"
                                rel="noopener noreferrer"
                            >GitHub
                            </Link>
                        </li>
                    </ul>
                    <div className="nav-actions">
                        {session?.user ? (
                            <Link href="/user" className={`btn-nav-ghost ${tabFont.className}`}>Dashboard</Link>
                        ) : (
                            <Link href="/login" className={`btn-nav-ghost ${tabFont.className}`}>Login</Link>
                        )}
                        <Link href="/docs" className={`btn-nav-primary ${tabFont.className} md:flex hidden`}>Get Started</Link>
                        <button className="md:hidden" aria-label="Menu" onClick={toggleMenu}>
                            {isMenuOpen ? (
                                <X className="menu-bar-toggle" />
                            ) : (
                                <Menu className="menu-bar-toggle" />
                            )}
                        </button>
                    </div>
                </div>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-(--bg) border-b border-(--border) overflow-hidden"
                        >
                            <ul className="flex flex-col p-5 gap-4">
                                <li>
                                    <Link href="#features" className={`${tabFont.className} text-(--muted2) hover:text-(--text) block py-2 transition-colors`} onClick={() => setIsMenuOpen(false)}>Features</Link>
                                </li>
                                <li>
                                    <Link href="/docs" className={`${tabFont.className} text-(--muted2) hover:text-(--text) block py-2 transition-colors`} onClick={() => setIsMenuOpen(false)}>Docs</Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://github.com/Dattatray8/doclessai-sdk"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${tabFont.className} text-(--muted2) hover:text-(--text) block py-2 transition-colors`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >GitHub
                                    </Link>
                                </li>
                                <li className="pt-2">
                                    <Link 
                                        href="/docs" 
                                        className={`btn-nav-primary ${tabFont.className} block text-center w-full py-2.5`} 
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <div className="p-4">
                {children}
            </div>
            <ChatWidget appKey={process.env.NEXT_PUBLIC_DOCLESSAI_APP_KEY!}
                name="DoclessAI" />
        </div>
    );
}
