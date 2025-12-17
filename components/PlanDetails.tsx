'use client';

import { Plan } from '@/utils/types';
import { Shield, Pill, Stethoscope, BriefcaseMedical } from 'lucide-react';
import clsx from 'clsx';
import { formatBenefit } from '@/utils/format';

export default function PlanDetails({ plan }: { plan: Plan }) {
    if (!plan) return null;

    return (
        <div className="space-y-4">

            {/* 1. CORE MEDICAL BENEFITS */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Medical Services</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <Row label="Primary Care" value={plan.benefits.primary_care} />
                    <Row label="Specialist" value={plan.benefits.specialist} />
                    <Row label="Urgent Care" value={plan.benefits.urgent_care} />
                    <Row label="Telehealth" value={plan.benefits.telehealth} />
                </div>
            </div>

            {/* 2. HOSPITAL & ER */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <BriefcaseMedical className="w-3.5 h-3.5 text-rose-500" />
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hospital & Emergency</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <Row label="Emergency Room" value={plan.benefits.emergency_room} />
                    {/* Assuming Hospital isn't explicitly in benefits map yet, could use logic or skip if not in data. 
                        The user added 'benefits' object but might not have a generic 'Hospital' key, checking types.ts...
                        types.ts has primary_care, specialist, urgent_care, emergency_room, telehealth, rx_tiers.
                        So we stick to those.
                    */}
                </div>
            </div>

            {/* 3. PHARMACY BENEFITS */}
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-emerald-500" />
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pharmacy</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <Row label="Generic (Tier 1)" value={plan.benefits.rx_tier_1} />
                    <Row label="Preferred (Tier 2)" value={plan.benefits.rx_tier_2} />
                    <Row label="Non-Preferred (Tier 3)" value={plan.benefits.rx_tier_3} />
                    <Row label="Specialty (Tier 4)" value={plan.benefits.rx_tier_4} />
                </div>
            </div>

            {/* 4. NETWORK & RULES */}
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan Rules</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <SimpleRow label="Network Type" value={plan.identity.network_type} />
                    <SimpleRow label="HSA Eligible" value={plan.financials.hsa_eligible ? 'Yes' : 'No'} />
                </div>
            </div>

        </div>
    );
}

function Row({ label, value }: { label: string, value: any }) {
    const formatted = formatBenefit(value);
    const isFree = formatted.includes('$0') || formatted.toLowerCase().includes('free');

    return (
        <div className="flex justify-between items-center py-2 px-3">
            <span className="text-[11px] font-medium text-slate-500">{label}</span>
            <span className={clsx("text-[11px] text-right max-w-[65%] truncate", isFree ? "font-bold text-emerald-600" : "font-medium text-slate-900")}>
                {formatted}
            </span>
        </div>
    );
}

function SimpleRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 px-3">
            <span className="text-[11px] font-medium text-slate-500">{label}</span>
            <span className="text-[11px] font-bold text-slate-900 text-right">{value}</span>
        </div>
    );
}