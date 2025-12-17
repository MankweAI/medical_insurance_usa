'use client';

import { useState, useEffect } from 'react';


export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Check session storage immediately to avoid flicker
        const hasSeenSplash = sessionStorage.getItem('healthos-splash-seen');

        if (hasSeenSplash) {
            setShowSplash(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('healthos-splash-seen', 'true');
            }, 500);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // 1. IF SPLASH IS DONE, JUST RETURN CHILDREN
    if (!showSplash) return <>{children}</>;

    return (
        <>
            {/* 2. SPLASH OVERLAY (The Curtain) */}
            {/* High Z-Index ensures it covers the content visually */}
            <div
                className={`fixed inset-0 z-[99999] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex flex-col items-center justify-center ${isExiting ? 'animate-splash-exit' : ''}`}
            >
                <div className="animate-splash-pulse">
                    <div className="w-24 h-22 bg-[#F0FDF4] rounded-[28px] flex items-center justify-center shadow-2xl shadow-emerald-900/30 overflow-hidden">
                        <img
                            src="/intellihealth-logo.png"
                            alt="Intellihealth Logo"
                            className="w-full h-full object-cover p-2"
                        />
                    </div>
                </div>

                <h1 className="mt-8 text-3xl font-black text-white tracking-tight">
                    Intellihealth
                </h1>
                <p className="mt-2 text-sm font-medium text-emerald-100/80 tracking-widest uppercase">
                    Virtual Actuary
                </p>
            </div>

            {/* 3. THE CONTENT (Visible to Bots, Hidden from Humans by the Curtain) */}
            {/* REMOVED: className="opacity-0" */}
            {/* ADDED: aria-hidden to prevent screen readers from reading it twice while splash is up (optional but good for a11y) */}
            <div aria-hidden={!isExiting}>
                {children}
            </div>
        </>
    );
}