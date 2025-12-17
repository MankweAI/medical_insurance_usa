'use client';

import { Plan } from '@/utils/types';
import { Shield } from 'lucide-react';
import clsx from 'clsx';

export default function PlanDetails({ plan }: { plan: Plan }) {
    if (!plan) return null;

    const net = plan.network_details || { hospitals: 'Unknown', gps: 'Unknown', specialists: 'Unknown' };

    return (
        <div className="space-y-4">

            {/* 1. NETWORK MATRIX */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Network Rules</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <Row label="Hospitals" value={net.hospitals} />
                    <Row label="GPs" value={net.gps} />
                    <Row label="Specialists" value={net.specialists} />
                </div>
            </div>

            {/* 2. CLINICAL BASKETS */}
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-100">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Benefits</h5>
                </div>
                <div className="divide-y divide-slate-50">
                    <Row label="Maternity" value={plan.defined_baskets.maternity.antenatal_consults > 0 ? `${plan.defined_baskets.maternity.antenatal_consults} Visits` : 'No Benefit'} isBold />
                    <Row label="Contraceptives" value={`R${plan.defined_baskets.preventative.contraceptives}`} isBold />
                    <Row label="MRI/CT Scans" value={plan.procedure_copays.mri_scan > 0 ? `R${plan.procedure_copays.mri_scan} Co-pay` : 'Covered'} isBold />
                </div>
            </div>

        </div>
    );
}

function Row({ label, value, isBold }: { label: string, value: string, isBold?: boolean }) {
    return (
        <div className="flex justify-between items-center py-2 px-3">
            <span className="text-[11px] font-medium text-slate-500">{label}</span>
            <span className={clsx("text-[11px] text-slate-900 text-right max-w-[65%] truncate", isBold ? "font-bold" : "font-medium")}>{value}</span>
        </div>
    );
}