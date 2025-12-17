import { Plan } from '@/utils/types';
import { Persona } from '@/utils/persona';

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
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{plan.identity.carrier_name}</span>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight mt-1">{plan.identity.plan_marketing_name}</h2>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getMetalColor(plan.identity.metal_level)}`}>
                    {plan.identity.metal_level} Plan
                </div>
            </div>

            {/* 2. PRICE SECTION (THE SUBSIDY REVEAL) */}
            <div className="px-6 py-8 text-center bg-gradient-to-b from-white to-slate-50">
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
                    Estimated annual cost of care: <span className="font-semibold text-slate-600">${financials.totalEstimatedCost.toLocaleString()}</span>
                </p>
            </div>

            {/* 3. KEY STATS GRID (DEDUCTIBLE vs MOOP) */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deductible</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${plan.financials.deductible_individual.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1 px-4 leading-tight">You pay this amount before insurance kicks in.</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Max Out-of-Pocket</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">${plan.financials.moop_individual.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1 px-4 leading-tight">The absolute most you will pay in a year.</p>
                </div>
            </div>

            {/* 4. BENEFITS LIST */}
            <div className="px-6 py-6 bg-white border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Key Benefits</h4>
                <div className="space-y-3">
                    <BenefitRow label="Doctor Visit" value={plan.benefits.primary_care_visit} />
                    <BenefitRow label="Specialist" value={plan.benefits.specialist_visit} />
                    <BenefitRow label="Generic Meds" value={plan.benefits.generic_drugs} />
                    <BenefitRow label="Emergency Room" value={plan.benefits.emergency_room} />
                </div>
            </div>

            {/* 5. CTA */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <a
                    href={plan.urls.brochure_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-center rounded-xl transition-all"
                >
                    View Official Brochure
                </a>
            </div>
        </div>
    );
}

// Simple Helper Component
function BenefitRow({ label, value }: { label: string, value: string }) {
    const isFree = value.toLowerCase().includes('0') || value.toLowerCase().includes('free') || value.toLowerCase().includes('no charge');
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={`font-semibold ${isFree ? 'text-green-600' : 'text-slate-900'}`}>
                {value}
            </span>
        </div>
    );
}