'use client';

import { Plan } from '@/utils/types';
import {
    Building2,
    Sparkles,
    CheckCircle2,
    ShieldAlert,
    Wallet,
    Phone,
    Activity,
    Zap,
    AlertTriangle,
    ShieldCheck // Added for the new button
} from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

interface FeedCardProps {
    plan: Plan;
    onVerify: () => void;
    verdict?: {
        tier: 'WINNER' | 'CONTENDER' | 'RISK';
        badge: string;
        warning: string;
    };
}

export default function FeedCard({ plan, onVerify, verdict }: FeedCardProps) {
    const [imgError, setImgError] = useState(false);

    if (!plan) return null;

    const schemeSlug = plan.identity.scheme_name.toLowerCase().replace(/\s+/g, '-');
    const logoPath = `/schemes-logo/${schemeSlug}.png`;
    const isWinner = verdict?.tier === 'WINNER';

    const fmt = (val: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(val);
    const limits = plan.limits || { oncology: { status: 'Unknown', value: 0 }, casualty: { status: 'Unknown', value: 0 } };

    // --- GAP COVER LOGIC ---
    const isGapOptional = plan.gap_cover_rating === 'Optional';
    const isGapMandatory = plan.gap_cover_rating === 'Mandatory';

    return (
        <div className={clsx(
            "relative bg-white rounded-3xl overflow-hidden transition-all h-full flex flex-col",
            isWinner
                ? "border border-emerald-200 shadow-xl shadow-emerald-200/60 border-l-4 border-l-emerald-500"
                : "border border-slate-200 shadow-lg shadow-slate-200/40"
        )}>
            {/* 1. HEADER */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "w-10 h-10 rounded-lg flex items-center justify-center p-1 shrink-0",
                            isWinner ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-100"
                        )}>
                            {!imgError ? (
                                <Image src={logoPath} alt={plan.identity.scheme_name} width={32} height={32} className="object-contain" onError={() => setImgError(true)} />
                            ) : (
                                <span className="text-slate-900 font-black text-[9px] uppercase">{plan.identity.scheme_name.substring(0, 3)}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-sm font-black text-slate-900 leading-none truncate">{plan.identity.plan_name}</h2>
                                {isWinner && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{plan.identity.plan_series}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={clsx("text-lg font-black leading-none", isWinner ? "text-emerald-700" : "text-slate-900")} suppressHydrationWarning>
                            {fmt(plan.price)}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">per month</div>
                    </div>
                </div>

                {plan.savings_annual > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 mb-3">
                        <Wallet className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-700">
                            Includes <span suppressHydrationWarning>{fmt(plan.savings_annual)}</span> savings/yr
                        </span>
                    </div>
                )}
            </div>

            {/* 2. VERDICT */}
            {verdict?.badge && (
                <div className="mx-4 mb-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl p-3 border border-emerald-100/80 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-current mt-0.5 shrink-0" />
                            <p className="text-[11px] text-slate-700 font-medium leading-snug">
                                <span className="font-bold text-emerald-700 block text-[9px] uppercase tracking-wider mb-0.5">Actuarial Verdict</span>
                                {verdict.badge}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. STATS GRID */}
            <div className="grid grid-cols-2 gap-2 mx-4 mb-3">
                <StatBox label="Hospital" value={`${plan.coverage_rates.hospital_account}%`} icon={Building2} color="emerald" />
                <StatBox label="Oncology" value={limits.oncology.status === 'Unlimited' ? 'Unlimited' : limits.oncology.value > 0 ? fmt(limits.oncology.value) : 'PMB Only'} icon={Activity} color="blue" />
                <StatBox label="Network" value={plan.network_restriction} icon={Wallet} color="slate" />
                <StatBox label="Casualty"
                    value={limits.casualty.status === 'No Benefit' ? 'No Benefit' : limits.casualty.value > 0 ? `R${limits.casualty.value}` : 'Savings'}
                    icon={Zap}
                    color={limits.casualty.status === 'No Benefit' ? 'rose' : 'slate'}
                />
            </div>

            {/* 4. GAP COVER (The New Home - With Logic) */}
            <div className="mx-4 mb-3">
                <div className={clsx("p-3 rounded-xl border flex items-start gap-3 transition-colors",
                    isGapMandatory ? "bg-rose-50 border-rose-100" :
                        isGapOptional ? "bg-emerald-50 border-emerald-100" :
                            "bg-blue-50 border-blue-100"
                )}>
                    {/* Icon Logic */}
                    <div className={clsx("p-1.5 rounded-full shrink-0 mt-0.5",
                        isGapMandatory ? "bg-rose-100 text-rose-600" :
                            isGapOptional ? "bg-emerald-100 text-emerald-600" :
                                "bg-blue-100 text-blue-600"
                    )}>
                        {isGapOptional ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider",
                                isGapMandatory ? "text-rose-700" :
                                    isGapOptional ? "text-emerald-700" :
                                        "text-blue-700"
                            )}>
                                Gap Cover: {plan.gap_cover_rating}
                            </span>
                        </div>
                        <p className={clsx("text-[10px] leading-snug mt-1 opacity-90",
                            isGapMandatory ? "text-rose-800" :
                                isGapOptional ? "text-emerald-800" :
                                    "text-blue-800"
                        )}>
                            {isGapMandatory ? "Plan pays 100%. Specialists charge up to 300%." :
                                isGapOptional ? "Plan covers up to 200%+. Low shortfall risk." :
                                    "Recommended to cover co-payments and sub-limits."}
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. WARNING */}
            {verdict?.warning && (
                <div className="mx-4 mb-auto">
                    <div className="p-2.5 bg-amber-50/80 border border-amber-100 rounded-xl flex gap-2 items-start">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Risk Warning</p>
                            <p className="text-xs font-medium text-amber-900 leading-snug">{verdict.warning}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. FOOTER - REDESIGNED BUTTON */}
            <div className="p-4 mt-2 border-t border-slate-100/50">
                <button
                    onClick={onVerify}
                    className={clsx(
                        "w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]",
                        isWinner
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700"
                    )}
                >
                    <ShieldCheck className={clsx("w-4 h-4", isWinner ? "text-emerald-100" : "text-emerald-600")} />
                    Check Your Coverage
                </button>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    const colors = {
        emerald: "text-emerald-500",
        blue: "text-blue-500",
        slate: "text-slate-400",
        rose: "text-rose-500"
    };

    return (
        <div className="flex flex-col justify-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={clsx("w-3 h-3", colors[color as keyof typeof colors] || colors.slate)} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-bold text-slate-900 truncate">{value}</span>
        </div>
    );
}