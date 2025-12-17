'use client';

import { Plan } from '@/utils/types';
import { ShieldCheck, FileText } from 'lucide-react'; // Swapped Phone for ShieldCheck
import PlanDetails from '@/components/PlanDetails';
import clsx from 'clsx';

export default function BenefitsCard({ plan, onVerify }: { plan: Plan; onVerify: () => void }) {
    return (
        <div className={clsx(
            "h-full bg-white rounded-3xl overflow-hidden flex flex-col relative w-full transition-all",
            // EXACT REPLICA of Card 1 "Winner" Style:
            "border border-emerald-200 shadow-xl shadow-emerald-200/60 border-l-4 border-l-emerald-500"
        )}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide leading-none mb-0.5">Clinical Breakdown</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Limits & Baskets</p>
                    </div>
                </div>
                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    2 of 2
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-5 flex-1">
                <PlanDetails plan={plan} />
            </div>

            {/* Footer CTA (Updated to Match Winner Style) */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-4 mt-auto">
                <button
                    onClick={onVerify}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    Check Your Coverage
                </button>
            </div>
        </div>
    )
}