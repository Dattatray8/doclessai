'use client'
import React from 'react';
import Link from "next/link";

const NotFound: React.FC = () => {
    return (
        <div className="mt-20 flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="relative">
                    <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">🔍</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-base-content">Page Not Found</h2>
                    <p className="text-base-content/70 max-w-md mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                    <button className="btn btn-primary" onClick={() => window.history.back()}>
                        Go Back
                    </button>
                    <Link href="/" className="btn btn-ghost">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;