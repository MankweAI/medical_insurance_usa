'use client';

import { usePersona } from '@/context/PersonaContext';
import { Users, Banknote, Shield, Baby, Wallet, HeartPulse, ArrowRight, Settings2, CheckCircle2, Activity } from 'lucide-react';
import clsx from 'clsx';

// --- CONFIGURATION CONSTANTS ---
const WHO_OPTIONS = [
    { label: 'Me', value: { main: 1, adult: 0, child: 0 } },
    { label: 'Couple', value: { main: 1, adult: 1, child: 0 } },
    { label: 'Single Parent', value: { main: 1, adult: 0, child: 1 } },
    { label: 'Family (3)', value: { main: 1, adult: 1, child: 1 } },
    { label: 'Family (4+)', value: { main: 1, adult: 1, child: 2 } },
];

const PRIORITY_OPTIONS = [
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'maternity', label: 'Maternity', icon: Baby },
    { id: 'chronic', label: 'Chronic', icon: HeartPulse },
    { id: 'comprehensive', label: 'Max Cover', icon: Shield },
];

const NETWORK_OPTIONS = [
    { id: 'Network', label: 'Network Hospitals', desc: 'Save ~20% on premium' },
    { id: 'Any', label: 'Any Hospital', desc: 'Freedom of choice' },
];

interface Props {
    onAnalyze: () => void;
}

export default function MagicSearch({ onAnalyze }: Props) {
    const { state, setMembers, setIncome, setFilter } = usePersona();
    const { members, income, filters } = state;

    // Helper: Compare complex objects for active state
    const isMemberActive = (val: typeof members) => JSON.stringify(members) === JSON.stringify(val);

    // Helper: Default network to 'Network' if null for UI consistency
    const activeNetwork = filters.network || 'Network';

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden font-sans mx-auto w-full">

            {/* 1. CONSOLE HEADER */}
            <div className="bg-slate-50/80 backdrop-blur border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
                        <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Input Parameters
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-medium text-emerald-600">LIVE</span>
                </div>
            </div>

            {/* 2. CONTROLS GRID */}
            <div className="px-6 py-6 md:py-8 space-y-8">

                {/* ROW A: DEMOGRAPHICS */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Beneficiaries Selector */}
                    <div className="space-y-3 min-w-0">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-3 h-3" /> Beneficiaries
                        </label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {WHO_OPTIONS.map((opt) => {
                                const active = isMemberActive(opt.value);
                                return (
                                    <button
                                        key={opt.label}
                                        onClick={() => setMembers(opt.value)}
                                        className={clsx(
                                            "flex-1 min-w-[70px] py-3 px-2 rounded-xl border-2 text-center transition-all active:scale-95 whitespace-nowrap",
                                            active
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <span className="block text-xs font-bold mb-0.5">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Income Slider */}
                    <div className="space-y-3 min-w-0">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Banknote className="w-3 h-3" /> Household Income
                        </label>
                        <div className="bg-slate-50 rounded-xl p-1 pr-4 border border-slate-100 flex items-center gap-3">
                            <div className="bg-white px-3 py-2.5 rounded-lg border border-slate-100 shadow-sm min-w-[100px] text-center">
                                <span
                                    className="text-sm font-black text-slate-900 font-mono"
                                    suppressHydrationWarning
                                >
                                    R{income.toLocaleString()}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="100000"
                                step="1000"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* ROW B: STRATEGY */}
                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">

                    {/* Optimization Goal */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Strategic Focus
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRIORITY_OPTIONS.map((p) => {
                                const active = filters.priority === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setFilter('priority', p.id)}
                                        className={clsx(
                                            "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left active:scale-[0.98]",
                                            active
                                                ? "border-blue-500 bg-blue-50 text-blue-900"
                                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <p.icon className={clsx("w-4 h-4", active ? "text-blue-600" : "text-slate-400")} />
                                        <span className="text-xs font-bold">{p.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Network Preference */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Shield className="w-3 h-3" /> Provider Access
                        </label>
                        <div className="grid grid-rows-2 gap-2">
                            {NETWORK_OPTIONS.map((opt) => {
                                const active = activeNetwork === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFilter('network', opt.id)}
                                        className={clsx(
                                            "flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all active:scale-[0.98]",
                                            active
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-bold">{opt.label}</span>
                                            <span className="text-[10px] opacity-70">{opt.desc}</span>
                                        </div>
                                        {active && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* 3. EXECUTION BAR */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-medium hidden md:block">
                    *Algorithms trained on 2026 CMS Registered Rules
                </div>
                <button
                    onClick={onAnalyze}
                    className="w-full md:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                    Initialize System
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}