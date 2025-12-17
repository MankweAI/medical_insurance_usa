import { PlanVariant, TaxHousehold } from '@/utils/types';
import { formatBenefit } from '@/utils/format'; // We may need to update this helper too, or inline it
import { Star, CheckCircle, FileText, Search, Pill } from 'lucide-react';

interface SinglePlanHeroProps {
    plan: PlanVariant;
    household: TaxHousehold;
    simulation: {
        totalNetPremiumAnnual: number;
        grandTotalCost: number;
        totalDeductiblePaid: number;
        totalMoopPaid: number;
    };
    // Pass standard gross/subsidy if needed, or derive
    grossPremiumAnnual: number;
    subsidyAnnual: number;
}

export default function SinglePlanHero({ plan, household, simulation, grossPremiumAnnual, subsidyAnnual }: SinglePlanHeroProps) {

    // Helper: Find Tier 1 Network
    const tier1 = plan.networks.find(n => n.tier === 'TIER_1_PREFERRED');
    if (!tier1) return <div>Data Error: Missing Network Information</div>;

    const getMetalColor = (level: string) => {
        // Safe check for string matching
        const l = level.toUpperCase();
        if (l.includes('BRONZE')) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (l.includes('SILVER')) return 'bg-slate-100 text-slate-800 border-slate-200';
        if (l.includes('GOLD')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (l.includes('PLATINUM')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        return 'bg-gray-100 text-gray-800';
    };

    // Calculate Monthly Values
    const netPremiumMonthly = Math.round(simulation.totalNetPremiumAnnual / 12);
    const grossPremiumMonthly = Math.round(grossPremiumAnnual / 12);
    const subsidyMonthly = Math.round(subsidyAnnual / 12);

    // Extract Benefits safely
    const getBenefit = (type: string) => plan.benefits.find(b => b.benefitType === type);
    const pcp = getBenefit('PRIMARY_CARE_VISIT');
    const spec = getBenefit('SPECIALIST');
    const genRx = getBenefit('GENERIC_DRUG');
    const er = getBenefit('EMERGENCY_ROOM');

    // Helper to format cost sharing
    const formatCost = (benefit: any) => {
        if (!benefit) return 'Not Covered';
        const tier1Cost = benefit.costSharing['TIER_1_PREFERRED'];
        if (!tier1Cost) return 'Check details';

        if (tier1Cost.type === 'COPAY') return `$${tier1Cost.amount?.value}`;
        if (tier1Cost.type === 'COINSURANCE') return `${tier1Cost.percent}%`;
        if (tier1Cost.type === 'NO_CHARGE') return '$0';
        return 'Check details';
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* 1. HEADER */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                            HealthOS Select
                        </span>
                        {/* Static Rating for now as it's not in new types yet, or add later */}
                        <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-700">4.5</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{plan.marketingName}</h2>
                </div>

                {/* Metal Badge */}
                <div className="flex flex-col items-end gap-1">
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getMetalColor(plan.marketingName)}`}>
                        {plan.variantType.split('_')[0]}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded bg-white">
                        HMO Network
                    </div>
                </div>
            </div>

            {/* 2. PRICE SECTION */}
            <div className="px-6 py-8 text-center bg-gradient-to-b from-white to-slate-50 relative">

                {/* HSA Logic (simplified: check if HDHP) */}
                {tier1.deductible.value >= 1600 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle className="w-3 h-3" /> Potential HSA
                    </div>
                )}

                {subsidyMonthly > 0 && (
                    <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                        You save ${subsidyMonthly}/mo with Tax Credits
                    </div>
                )}

                <div className="flex items-center justify-center gap-2">
                    {subsidyMonthly > 0 && (
                        <span className="text-lg text-slate-400 line-through decoration-red-400 decoration-2">
                            ${grossPremiumMonthly}
                        </span>
                    )}
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                        ${netPremiumMonthly}
                    </span>
                    <span className="text-lg text-slate-500 font-medium self-end mb-1">/mo</span>
                </div>

                <p className="text-sm text-slate-400 mt-2">
                    Estimated total annual exposure: <span className="font-semibold text-slate-600">${simulation.grandTotalCost.toLocaleString('en-US')}</span>
                </p>
            </div>

            {/* 3. KEY STATS GRID (Embedded Logic) */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deductible</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${tier1.deductible.value.toLocaleString('en-US')}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                        (Indiv / Family 2x)
                    </p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Max Out-of-Pocket</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">${tier1.moop.value.toLocaleString('en-US')}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                        (Stop-Loss Limit)
                    </p>
                </div>
            </div>

            {/* 4. KEY BENEFITS LIST */}
            <div className="px-6 py-6 bg-white border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Key Benefits Highlight</h4>
                <div className="space-y-3">
                    <BenefitRow label="Doctor Visit" value={formatCost(pcp)} />
                    <BenefitRow label="Specialist" value={formatCost(spec)} />
                    <BenefitRow label="Generic Meds" value={formatCost(genRx)} />
                    {/* Placeholder for ER if not in standard seed yet */}
                    <BenefitRow label="Emergency Room" value={formatCost(er) || 'Check Details'} />
                </div>
            </div>

            {/* 5. RESOURCE FOOTER (Static for Prototype) */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group cursor-pointer">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Brochure</span>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group cursor-pointer">
                    <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Find Doctor</span>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 group cursor-pointer">
                    <Pill className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500">Drug List</span>
                </div>
            </div>
        </div>
    );
}

function BenefitRow({ label, value }: { label: string, value: string }) {
    const isFree = value.toLowerCase().includes('$0') || value.toLowerCase().includes('free') || value.toLowerCase().includes('no charge');

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={`font-semibold ${isFree ? 'text-green-600' : 'text-slate-900'}`}>
                {value}
            </span>
        </div>
    );
}