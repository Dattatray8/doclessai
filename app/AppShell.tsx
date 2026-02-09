'use client';

import ThemeController from "@/components/ThemeController";
import {handleSignOut} from "@/helpers/client/user";
import {LogOut} from "lucide-react";
import {Archivo_Black} from "next/font/google";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {ChatWidget} from "@doclessai/sdk";

const appNameFont = Archivo_Black({
    subsets: ['latin'],
    weight: ['400']
});

export default function AppShell({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const {data: session} = useSession();

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content">
                <nav className="navbar w-full bg-base-300 flex items-center justify-between">
                    <div className="flex items-center ">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round"
                                 strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"
                                 className="my-1.5 inline-block size-6">
                                <path
                                    d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 4v16"></path>
                                <path d="M14 10l2 2l-2 2"></path>
                            </svg>
                        </label>
                        <Link href={'/'} className={`${appNameFont.className} text-2xl`}>DoclessAI</Link>
                    </div>
                    <div className="flex items-center pr-4 gap-4">
                        <div><ThemeController/></div>
                        {session?.user && (
                            <LogOut onClick={() => handleSignOut(router, dispatch)}
                                    className="cursor-pointer hover:text-accent transition-all"/>
                        )}
                    </div>
                </nav>
                <div className="p-4">
                    {children}
                </div>
            </div>
            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div
                    className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <ul className="menu w-full grow">
                        <li>
                            <Link href={'/'}>
                                <button
                                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-2"
                                    data-tip="Homepage">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round"
                                         strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"
                                         className="my-1.5 inline-block size-4">
                                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                        <path
                                            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Homepage</span>
                                </button>
                            </Link>
                        </li>

                        <li>
                            <Link href={'/user'}>
                                <button
                                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-2"
                                    data-tip="Profile"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="my-1.5 inline-block size-4"
                                    >
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/>
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
                                    </svg>

                                    <span className="is-drawer-close:hidden">Profile</span>
                                </button>
                            </Link>

                        </li>
                    </ul>
                </div>
            </div>
            <ChatWidget appKey="doclessai_live_49dc73c122c28d1ba1f706905ece7df1a84caba067f5e22ed5ff14de01bef5e1"
                        name="DoclessAI"/>
        </div>
    );
}
