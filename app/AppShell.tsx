'use client';

import { handleSignOut } from "@/helpers/client/user";
import { LogOut } from "lucide-react";
import { Archivo_Black, Sora } from "next/font/google";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatWidget } from "@doclessai/sdk";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
});

const tabFont = Sora({
    subsets: ['latin'],
    weight: ['500']
})

export default function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();

    return (
        <div className="">
            <nav className="nav-wrap">
                <div className="nav-inner">
                    <div className="flex items-center ">
                        <Link href={'/'} className={`${appNameFont.className} text-2xl`}>DoclessAI</Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link href="#features" className={tabFont.className}>Features</Link></li>
                        <li><Link href="/docs" className={tabFont.className}>Docs</Link></li>
                        <li>
                            <Link
                                href="https://github.com/Dattatray8/doclessai-sdk"
                                target="_blank"
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
                        <Link href="/docs" className={`btn-nav-primary ${tabFont.className}`}>Get Started</Link>
                        <button className="hamburger" aria-label="Menu">
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </nav>
            <div className="p-4">
                {children}
            </div>
            <ChatWidget appKey="doclessai_live_49dc73c122c28d1ba1f706905ece7df1a84caba067f5e22ed5ff14de01bef5e1"
                name="DoclessAI" />
        </div>
    );
}
