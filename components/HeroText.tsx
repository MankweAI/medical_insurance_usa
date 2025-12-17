import { Persona } from '@/utils/persona';
import {
    MapPin,
    Calendar,
    User,
    Wallet,
    Users,
    Activity,
    Check
} from 'lucide-react';
import clsx from 'clsx';

interface HeroTextProps {
    persona: Persona;
}

export default function HeroText({ persona }: HeroTextProps) {
    const currentYear = new Date().getFullYear() + 1;

    const getKeywords = (category: string) => {
        switch (category) {
            case 'Young Invincible': return ['Cheapest Options', 'Catastrophic Protection'];
            case 'Low Income Family': return ['Max Subsidies', 'Low Deductible'];
            case 'Chronic Care': return ['Specialist Access', 'Rx Coverage'];
            case 'High Earner': return ['Tax Advantages', 'HSA Strategy'];
            default: return ['ACA Compliant', 'Marketplace Plans'];
        }
    };
    const tags = getKeywords(persona.meta.category);

    return (
        <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-2 duration-1000">

            {/* 1. TOP LABEL: The "System Status" Look */}
            <div className="flex items-center gap-2 mb-6">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                    Analysis for {currentYear}
                </span>
                <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* 2. MAIN HEADER */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                    {persona.meta.title}
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {persona.meta.category} Strategy
                    </span>
                </div>
            </div>

            {/* 3. CLEAN STATS ROW (Divider Style) */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-slate-500 font-medium mb-8">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Age {persona.demographics.age}</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{persona.demographics.zip_code}</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{persona.demographics.household_size} Member{persona.demographics.household_size > 1 ? 's' : ''}</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-400" />
                    <span>${persona.demographics.household_income.toLocaleString('en-US')} / yr</span>
                </div>
            </div>

            {/* 4. THE MISSION STATEMENT (Minimalist) */}
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
                    &ldquo;{persona.meta.marketing_hook}&rdquo;
                </p>

                {/* 5. TAGS (Ghost Style) */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50">
                            <Check className="w-3 h-3 text-emerald-500" />
                            {tag}
                        </span>
                    ))}
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        ACA Compliant
                    </span>
                </div>
            </div>

        </div>
    );
}