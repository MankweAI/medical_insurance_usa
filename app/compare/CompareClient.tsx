'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Baby, Pill, Zap, PlusCircle } from 'lucide-react';
import clsx from 'clsx';
import { usePersona } from '@/context/PersonaContext';
import ReviewToast from '@/components/ReviewToast';
import { Plan } from '@/utils/types';

const SCENARIOS = [
    { id: 'general', label: 'General Overview', icon: Shield },
    { id: 'maternity', label: 'Having a Baby', icon: Baby },
    { id: 'chronic', label: 'Chronic Illness', icon: Pill },
];

interface Props {
    plans: Plan[];
}

export default function CompareClient({ plans }: Props) {
    const { activePersonaPath } = usePersona();
    const [activeScenario, setActiveScenario] = useState('general');

    const planA = plans[0];
    const planB = plans[1];

    // --- EMPTY STATE LOGIC ---
    if (!planA || !planB) {
        return (
            <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <Shield className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Battle Arena Empty</h1>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
                    To start a head-to-head comparison, you need to select at least 2 strategies from the diagnosis results.
                </p>
                <Link
                    href={activePersonaPath || '/'}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
                >
                    <PlusCircle className="w-5 h-5" />
                    Find Plans to Compare
                </Link>
            </main>
        );
    }

    // --- DATA MAPPING HELPERS ---
    const getAnnualCost = (p: Plan) => (p.price || 0) * 12;
    const getRiskMetric = (p: Plan) => p.procedure_copays?.scope_in_hospital || 0; // Proxy for risk

    return (
        <main className="min-h-screen bg-slate-50 pb-32">

            {/* Header & Navigation */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <Link href={activePersonaPath || '/'} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Head-to-Head
                </h1>
                <div className="w-8" />
            </header>

            <div className="max-w-2xl mx-auto p-6 space-y-8">

                {/* LIABILITY BATTLE */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
                        Annual Financial Impact
                    </h2>

                    <div className="space-y-8">
                        {[planA, planB].map((plan) => {
                            const annual = getAnnualCost(plan);
                            const savings = plan.savings_annual || 0;
                            const savingsPct = annual > 0 ? (savings / annual) * 100 : 0;

                            return (
                                <div key={plan.id}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-black text-slate-900 text-lg">{plan.identity.plan_name}</span>
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-slate-400 uppercase">Fixed Cost</span>
                                            <span className="font-bold text-slate-900">R{formatRand(annual)}</span>
                                        </div>
                                    </div>

                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                                        <div className="h-full bg-slate-300 w-full" />
                                        {savings > 0 && (
                                            <div
                                                className="h-full bg-emerald-500 absolute left-0 top-0 opacity-80"
                                                style={{ width: `${savingsPct}%` }}
                                            />
                                        )}
                                        {/* Visualizing Risk as a % of Annual Cost (Abstract) */}
                                        <div
                                            className="h-full bg-rose-500 absolute right-0 top-0 opacity-40 border-l-2 border-white"
                                            style={{ width: `10%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Savings: R{formatRand(savings)}
                                        </div>
                                        <div className="flex items-center gap-1 text-rose-500">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 opacity-50" />
                                            Risk Limit: R{formatRand(getRiskMetric(plan))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* SCENARIO SELECTOR */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {SCENARIOS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveScenario(s.id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border shrink-0",
                                activeScenario === s.id
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <s.icon className="w-4 h-4" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* COMPARISON GRID */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-4">
                        <div className="col-span-1" />
                        <div className="col-span-1 text-center font-bold text-xs text-slate-900">{planA.identity?.plan_name}</div>
                        <div className="col-span-1 text-center font-bold text-xs text-slate-900">{planB.identity?.plan_name}</div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        <Row
                            label="Hospitals"
                            valA={planA.network_restriction === 'Any' ? 'Any Private' : planA.network_restriction}
                            valB={planB.network_restriction === 'Any' ? 'Any Private' : planB.network_restriction}
                            highlightDiff
                        />
                        <Row
                            label="Maternity"
                            valA={`${planA.defined_baskets.maternity.antenatal_consults} Antenatal`}
                            valB={`${planB.defined_baskets.maternity.antenatal_consults} Antenatal`}
                        />
                        {activeScenario === 'chronic' && (
                            <Row
                                label="Chronic Meds"
                                valA={planA.identity.plan_type === 'Hospital Plan' ? 'CDL Only' : 'Broad Cover'}
                                valB={planB.identity.plan_type === 'Hospital Plan' ? 'CDL Only' : 'Broad Cover'}
                                highlightDiff
                            />
                        )}
                        <Row
                            label="Specialists"
                            valA={`${planA.coverage_rates.specialist_in_hospital}% (In-H)`}
                            valB={`${planB.coverage_rates.specialist_in_hospital}% (In-H)`}
                            highlightDiff
                        />
                    </div>
                </div>

                {/* VERDICT */}
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex gap-4">
                    <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                        <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 text-sm mb-2">The Virtual Actuary Verdict</h3>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Comparing <strong>{planA.identity.plan_name}</strong> and <strong>{planB.identity.plan_name}</strong>.
                            {planB.price > planA.price ?
                                ` The ${planB.identity.plan_name} costs R${formatRand(planB.price - planA.price)} more, offering ${planB.network_restriction === 'Any' ? 'unrestricted' : planB.network_restriction} access.`
                                :
                                ` The ${planB.identity.plan_name} is R${formatRand(planA.price - planB.price)} cheaper.`
                            }
                        </p>
                    </div>
                </div>

            </div>
            <ReviewToast />
        </main>
    );
}

function Row({ label, valA, valB, highlightDiff }: { label: string, valA: string, valB: string, highlightDiff?: boolean }) {
    const isDifferent = valA !== valB;
    const opacity = !highlightDiff || isDifferent ? "opacity-100" : "opacity-40 grayscale";

    return (
        <div className={clsx("grid grid-cols-3 p-4 items-center text-xs", opacity)}>
            <div className="font-bold text-slate-400 uppercase">{label}</div>
            <div className={clsx("text-center font-medium", isDifferent && highlightDiff ? "text-slate-900" : "text-slate-500")}>
                {valA}
            </div>
            <div className={clsx("text-center font-medium", isDifferent && highlightDiff ? "text-slate-900" : "text-slate-500")}>
                {valB}
            </div>
        </div>
    );
}

function formatRand(amount: number) {
    return amount.toLocaleString('en-US').replace(/,/g, ' ');
}
