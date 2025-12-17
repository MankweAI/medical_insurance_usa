'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';

export default function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    // Subscribe to chat state
    const { isChatOpen } = usePersona();

    // Hide header entirely when chat is open
    if (isChatOpen) return null;

    return (
        /* Updated classes:
           - kept 'fixed top-0 left-0 right-0 z-50' for positioning
           - added 'w-full' to ensure it stretches
           - added 'md:max-w-[600px]' to match #app-frame constraints
           - added 'mx-auto' to center it within the viewport when constrained
        */
        <header className="fixed top-0 left-0 right-0 z-50 w-full md:max-w-[600px] mx-auto">
            <div className="w-full flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-500 backdrop-blur-xl border-b border-emerald-400/30 shadow-lg shadow-emerald-900/20 p-3 px-5 transition-all">

                {/* BRAND / BACK BUTTON */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl  flex items-center justify-center shadow-lg overflow-hidden bg-[#F0FDF4]">
                        <img
                            src="/intellihealth-logo.png"
                            alt="Intellihealth Logo"
                            className="w-full h-full object-cover p-1"
                        />
                    </div>
                    <Link href="/" className="flex flex-col">
                        <span className="font-black text-white tracking-tight text-sm leading-none">
                            Intellihealth
                        </span>
                        <span className="text-[9px] font-bold text-emerald-100/80 uppercase tracking-wider">
                            Virtual Actuary
                        </span>
                    </Link>
                </div>

                {/* STATUS INDICATOR */}
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-100/80 uppercase hidden sm:block">
                        2026 Rules Active
                    </span>
                </div>

            </div>
        </header>
    );
}