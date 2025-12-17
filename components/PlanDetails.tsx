'use client';

import { PlanVariant } from '@/utils/types';
import { Pill, Stethoscope } from 'lucide-react';

export default function PlanDetails({ plan }: { plan: PlanVariant }) {

    // Sort benefits by priority
    const sortedBenefits = [...plan.benefits].sort((a, b) => {
        if (a.benefitType === 'PRIMARY_CARE_VISIT') return -1;
        if (b.benefitType === 'PRIMARY_CARE_VISIT') return 1;
        return 0;
    });

    const formatCost = (benefit: any) => {
        const tier1 = benefit.costSharing?.TIER_1_PREFERRED;
        if (!tier1) return 'Not Covered';
        if (tier1.type === 'COPAY') return `$${tier1.amount?.value}`;
        if (tier1.type === 'COINSURANCE') return `${tier1.percent}%`;
        if (tier1.type === 'NO_CHARGE') return '$0';
        return 'Check Details';
    };

    return (
        <div className="space-y-6">

            {/* Core Medical */}
            <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <Stethoscope className="w-3 h-3" /> Core Medical
                </h4>
                <div className="space-y-3">
                    {sortedBenefits.filter(b => ['PRIMARY_CARE_VISIT', 'SPECIALIST', 'URGENT_CARE', 'EMERGENCY_ROOM'].includes(b.benefitType)).map((benefit, idx) => (
                        <SimpleRow
                            key={idx}
                            label={benefit.benefitType.replace(/_/g, ' ')}
                            value={formatCost(benefit)}
                        />
                    ))}
                </div>
            </div>

            {/* Pharmacy */}
            <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <Pill className="w-3 h-3" /> Pharmacy
                </h4>
                <div className="space-y-3">
                    {sortedBenefits.filter(b => b.benefitType === 'GENERIC_DRUG' || b.benefitType === 'SPECIALTY_DRUG').map((benefit, idx) => (
                        <SimpleRow
                            key={idx}
                            label={benefit.benefitType.replace(/_/g, ' ')}
                            value={formatCost(benefit)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}

function SimpleRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded">
            <span className="text-xs font-medium text-slate-500 capitalize truncate max-w-[60%]">{label.toLowerCase()}</span>
            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}