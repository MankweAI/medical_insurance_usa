import { Persona } from '@/utils/persona';
import { ShieldCheck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface HeroTextProps {
    persona: Persona;
}

export default function HeroText({ persona }: HeroTextProps) {
    const currentYear = new Date().getFullYear() + 1; // Always target next year (2026) for SEO

    // SEO LOGIC: Generate specific keywords based on category
    const getKeywords = (category: string) => {
        switch (category) {
            case 'Young Invincible': return ['Cheapest Options', 'Catastrophic Protection', 'Emergency Only'];
            case 'Low Income Family': return ['Max Subsidies', 'Low Deductible', 'CSR Eligible'];
            case 'Chronic Care': return ['Specialist Access', 'Prescription Coverage', 'No Referrals'];
            case 'High Earner': return ['Tax Advantages', 'HSA Strategy', 'Asset Protection'];
            default: return ['ACA Compliant', 'Marketplace Plans'];
        }
    };

    const tags = getKeywords(persona.meta.category);

    return (
        <div className="max-w-3xl mx-auto mb-8 text-center sm:text-left animate-in slide-in-from-bottom-4 duration-500">

            {/* 1. TRUST BADGES (The "Verified" Signal) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ACA Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
                    <Calendar className="w-3 h-3" />
                    <span>{currentYear} Strategy</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-100">
                    <MapPin className="w-3 h-3" />
                    <span>Zip {persona.demographics.zip_code}</span>
                </div>
            </div>

            {/* 2. SEMANTIC H1 (The Persona Title) */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                <span className="block">{persona.meta.title}</span>
                {/* NEW: Inject the SEO Category as a subtitle */}
                <span className="block text-lg text-blue-600 font-bold mt-1 uppercase tracking-wide">
                    {persona.meta.category} Strategy
                </span>
            </h1>

            {/* 3. THE CONTEXT LINE (Hyper-Specific User Definition) */}
            <div className="text-sm font-medium text-slate-500 mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Optimized for a {persona.demographics.age}-year-old with household income of ${persona.demographics.household_income.toLocaleString('en-US')}.
            </div>

            {/* 4. THE HOOK (P) */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 border-l-4 border-blue-500 pl-4 bg-slate-50/50 py-2 rounded-r-lg">
                {persona.meta.marketing_hook}
            </p>

            {/* 5. KEYWORD CHIPS (Search Intent Matching) */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3 h-3 text-slate-300" />
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}