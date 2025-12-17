import { FrontendScenario } from '@/data/local-seed-scenarios';
import {
    MapPin,
    Users,
    Wallet,
    Sparkles,
    ShieldCheck,
    TrendingDown,
    Cake
} from 'lucide-react';
import clsx from 'clsx';

interface HeroTextProps {
    persona: FrontendScenario;
}

export default function HeroText({ persona }: HeroTextProps) {
    const currentYear = new Date().getFullYear() + 1;
    const isSubsidyEligible = persona.aptcEligible;
    const isCsrEligible = persona.csrEligible;

    // Logic: Find primary subscriber age
    const subscriber = persona.members.find(m => m.relationshipToSubscriber === 'SELF');
    const primaryAge = subscriber ? subscriber.age : 30;

    // LOGIC: Convert specific age to standard insurance bracket
    const getAgeBracket = (age: number) => {
        const lower = Math.floor(age / 5) * 5;
        const upper = lower + 4;
        return `${lower}-${upper}`;
    };

    // LOGIC: Convert count to readable label
    const getHouseholdLabel = (count: number) => {
        return count === 1 ? 'Individual' : `Family of ${count}`;
    };

    return (
        <div className="max-w-4xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">

            {/* 1. EDITORIAL HEADER */}
            <div className="text-center mb-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        {currentYear} Strategy: {persona.meta.category}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                    {persona.meta.title}
                </h1>

                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                    {persona.meta.marketing_hook}
                </p>
            </div>

            {/* 2. THE "GLASS RIBBON": Unified Data Context */}
            <div className="flex justify-center">
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg shadow-slate-200/40 rounded-2xl p-1.5 inline-flex flex-wrap md:flex-nowrap items-center gap-1.5">

                    {/* Segment A: Location & Age Bracket */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 h-10">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400"><MapPin size={14} /></span>
                            <span className="text-xs font-bold text-slate-700">{persona.zipCode}</span>
                        </div>
                        <div className="w-px h-3 bg-slate-200" />
                        <div className="flex items-center gap-1.5 h-10 w-22">
                            <span className="text-slate-400"><Cake size={14} /></span>
                            <span className="text-xs font-bold text-slate-700"> Age {getAgeBracket(primaryAge)}</span>
                        </div>
                    </div>

                    {/* Segment B: Household (Updated Style) */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 h-10">
                        <Users size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                            {getHouseholdLabel(persona.members.length)}
                        </span>
                    </div>

                    {/* Segment C: Financial Context */}
                    <div className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors h-10",
                        isSubsidyEligible
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-slate-50 border-slate-100 text-slate-700"
                    )}>
                        {isSubsidyEligible ? (
                            <TrendingDown size={14} className="text-emerald-600" />
                        ) : (
                            <Wallet size={14} className="text-slate-400" />
                        )}

                        <span className="text-xs font-bold">
                            ${persona.incomeMagi.toLocaleString()}/yr
                        </span>

                        {isSubsidyEligible && (
                            <span className="hidden md:inline-flex items-center gap-1 ml-1 pl-2 border-l border-emerald-200 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                <Sparkles size={10} /> Subsidy Eligible
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. FOCUS TAGS */}
            <div className="mt-8 flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={12} /> ACA Compliant
                </div>
                {isCsrEligible && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <TrendingDown size={12} /> CSR Savings Active
                    </div>
                )}
            </div>
        </div>
    );
}