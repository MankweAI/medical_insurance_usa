import { Plan } from '@/utils/types';
import { Persona } from '@/utils/persona';
import { formatBenefit } from '@/utils/format';
import { Star, CheckCircle, FileText, Search, Pill } from 'lucide-react';

interface SinglePlanHeroProps {
    plan: Plan;
    persona: Persona;
    financials: any; // We use the output from PricingEngine
}

export default function SinglePlanHero({ plan, persona, financials }: SinglePlanHeroProps) {

    // Helper for Metal Colors
    const getMetalColor = (level: string) => {
        switch (level) {
            case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Silver': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Platinum': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* 1. HEADER: CARRIER & METAL */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        {plan.identity.carrier_name}
                    </span>
                    {/* NEW: Quality Rating */}
                    {plan.identity.quality_rating > 0 && (
                        <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-700">{plan.identity.quality_rating}</span>
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{plan.identity.plan_marketing_name}</h2>
            </div>

            {/* NEW: Network & Metal Badges */}
            <div className="flex flex-col items-end gap-1">
                <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getMetalColor(plan.identity.metal_level)}`}>
                    {plan.identity.metal_level}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded bg-white">
                    {plan.identity.network_type} Network
                </div>
            </div>

            {/* 2. PRICE SECTION (THE SUBSIDY REVEAL) */}
            <div className="px-6 py-8 text-center bg-gradient-to-b from-white to-slate-50">
                {/* NEW: HSA Badge */}
                {plan.financials.hsa_eligible && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle className="w-3 h-3" /> HSA Eligible
                    </div>
                )}
                {financials.subsidyApplied > 0 && (
                    <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                        You save ${financials.subsidyApplied}/mo with Tax Credits
                    </div>
                )}

                <div className="flex items-center justify-center gap-2">
                    {/* Strikethrough for Gross Price */}
                    {financials.subsidyApplied > 0 && (
                        <span className="text-lg text-slate-400 line-through decoration-red-400 decoration-2">
                            ${financials.grossPremium}
                        </span>
                    )}

                    {/* The Big Net Price */}
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                        ${financials.netPremium}
                    </span>
                    <span className="text-lg text-slate-500 font-medium self-end mb-1">/mo</span>
                </div>

                <p className="text-sm text-slate-400 mt-2">
                    Estimated annual cost of care: <span className="font-semibold text-slate-600">${financials.totalEstimatedCost.toLocaleString('en-US')}</span>
                </p>
            </div>

            {/* 3. KEY STATS GRID (DEDUCTIBLE vs MOOP) */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deductible</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${plan.financials.deductible_individual.toLocaleString()}</p>
                    {/* NEW: Family Hint */}
                    <p className="text-[10px] text-slate-400 mt-1">
                        (Family: ${plan.financials.deductible_family.toLocaleString()})
                    </p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Max Out-of-Pocket</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">${plan.financials.moop_individual.toLocaleString()}</p>
                    {/* NEW: Family Hint */}
                    <p className="text-[10px] text-slate-400 mt-1">
                        (Family: ${plan.financials.moop_family.toLocaleString()})
                    </p>
                </div>
            </div>

            {/* 4. BENEFITS LIST */}
            <div className="px-6 py-6 bg-white border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Key Benefits</h4>
                <div className="space-y-3">
                    <BenefitRow label="Doctor Visit" value={plan.benefits.primary_care} />
                    <BenefitRow label="Specialist" value={plan.benefits.specialist} />
                    <BenefitRow label="Generic Meds" value={plan.benefits.rx_tier_1} />
                    <BenefitRow label="Emergency Room" value={plan.benefits.emergency_room} />
                </div>
            </div>

            {/* 5. FOOTER: UPGRADED to Resource Grid */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                <a href={plan.urls.brochure_pdf} target="_blank" className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Brochure</span>
                </a>
                <a href={plan.urls.provider_directory} target="_blank" className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group">
                    <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Find Doctor</span>
                </a>
                <a href={plan.urls.formulary_drug_list} target="_blank" className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group">
                    <Pill className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Drug List</span>
                </a>
            </div>
        </div>
    );
}

// Simple Helper Component
function BenefitRow({ label, value }: { label: string, value: any }) {
    const formatted = typeof value === 'object' ? formatBenefit(value) : value;
    const isFree = formatted.toLowerCase().includes('$0') || formatted.toLowerCase().includes('free') || formatted.toLowerCase().includes('no charge');

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={`font-semibold ${isFree ? 'text-green-600' : 'text-slate-900'}`}>
                {formatted}
            </span>
        </div>
    );
}