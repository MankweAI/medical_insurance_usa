'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';
import MagicSearch from '@/components/MagicSearch';
import ControlPanel from '@/components/ControlPanel'; // Integrated Context
import TrustTicker from '@/components/TrustTicker';
import { Zap, ChevronRight, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function HomeHero() {
    const { state } = usePersona();
    const router = useRouter();
    const [view, setView] = useState<'input' | 'processing'>('input');

    const handleDiagnosisStart = () => {
        setView('processing');
        // Simulate Actuarial Calculation Time (2.5s)
        setTimeout(() => {
            // FIX: Replaced invalid hardcoded slug with a valid one from data/personas.ts
            const targetSlug = state.persona || 'bestmed-beat1-network-budget-starter-2026';
            router.push(`/personas/${targetSlug}?income=${state.income}`);
        }, 2500);
    };

    const TICKER_MESSAGES = [
        "Initializing 2026 Rules Engine...",
        `Calibrating for Income Band R${(state.income / 1000).toFixed(0)}k...`,
        "Scanning Network Geofences...",
        "Optimizing Risk Ratios..."
    ];

    return (
        <section className="w-full max-w-3xl mx-auto relative z-20">

            {/* WELCOME HERO SECTION */}
            <div className="text-center mb-8 px-4 animate-in fade-in slide-in-from-top-4 duration-700">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-emerald-100 rounded-full px-3 py-1 mb-6 shadow-sm">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        2026 Rules Active
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-5 leading-[1.1]">
                    Intellihealth <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                        Virtual Actuary
                    </span>
                </h1>

                {/* Description Subtitle */}
                <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                    Navigate the complexity of medical aid. Compare 70+ plans, analyze hidden benefits, and calculate your exact risk profile in seconds.
                </p>
            </div>

            {/* MAIN INTERFACE CARD */}
            <GlassCard className="p-1 overflow-hidden shadow-2xl shadow-emerald-900/10 border-slate-200/60">
                {view === 'input' ? (
                    <div className="bg-white/80 rounded-xl backdrop-blur-xl">

                        {/* 1. CONTEXT LAYER (Who) */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block pl-1">
                                1. Define Parameters
                            </label>
                            <div className="scale-95 origin-top-left w-[105%]">
                                <ControlPanel />
                            </div>
                        </div>

                        {/* 2. INTENT LAYER (What) */}
                        <div className="p-6 pb-8">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                                2. Execute Command
                            </label>
                            <MagicSearch onAnalyze={handleDiagnosisStart} />
                        </div>

                        {/* STATUS FOOTER */}
                        <div className="bg-slate-900 text-slate-400 p-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest px-6">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                <span>AI Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Awaiting Input</span>
                                <span className="w-2 h-4 bg-emerald-500/50 animate-pulse block" />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* PROCESSING STATE */
                    <div className="w-full py-20 text-center animate-in fade-in bg-white/95 rounded-xl backdrop-blur-xl flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                            <div className="w-20 h-20 bg-white border border-emerald-100 rounded-2xl flex items-center justify-center relative shadow-lg z-10">
                                <Zap className="w-8 h-8 text-emerald-600 animate-pulse" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mb-2">Running Simulation</h2>
                        <div className="h-6 mb-8 flex justify-center w-full">
                            <TrustTicker messages={TICKER_MESSAGES} />
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-1/3 animate-[translateX_1s_ease-in-out_infinite] rounded-full" />
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Quick Links (Bottom) */}
            {view === 'input' && (
                <div className="mt-8 flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <button onClick={() => router.push('/methodology')} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        View Logic <ChevronRight className="w-3 h-3" />
                    </button>
                    <button onClick={() => router.push('/compare')} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        Compare Datasets <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            )}
        </section>
    );
}