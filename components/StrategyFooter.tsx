import { Plan } from '@/utils/types';
import { Persona } from '@/utils/persona';
import Link from 'next/link';

interface StrategyFooterProps {
    plan: Plan;
    persona: Persona;
    pivots: {
        cheaper: { plan: Plan, persona: Persona } | null;
        richer: { plan: Plan, persona: Persona } | null;
    };
}

export default function StrategyFooter({ plan, persona, pivots }: StrategyFooterProps) {
    return (
        <div className="space-y-8 animate-slide-up-fade">

            {/* 1. THE NARRATIVE (Why this plan wins) */}
            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-lg">
                        ?
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Why this specific plan?</h3>
                        <p className="text-slate-600 mt-2 leading-relaxed">
                            {persona.narrative.solution}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. THE WARNING (Compliance / Risk) */}
            <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 font-bold text-lg">
                        !
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Risk Analysis</h3>
                        <p className="text-slate-600 mt-2 leading-relaxed">
                            {persona.narrative.warning}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. THE PIVOTS (Upsell / Downsell) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* CHEAPER OPTION */}
                {pivots.cheaper ? (
                    <Link href={`/personas/${pivots.cheaper.persona.slug}`} className="group block">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 block">
                                Save Money
                            </span>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Switch to {pivots.cheaper.plan.identity.metal_level}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Lower monthly cost, but higher risk if you get sick.
                            </p>
                        </div>
                    </Link>
                ) : (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 opacity-60">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Lowest Price</span>
                        <div className="font-bold text-slate-500">No Cheaper Options</div>
                        <p className="text-xs text-slate-400 mt-2">You are already on the most affordable plan tier.</p>
                    </div>
                )}

                {/* RICHER OPTION */}
                {pivots.richer ? (
                    <Link href={`/personas/${pivots.richer.persona.slug}`} className="group block">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">
                                Lower Risk
                            </span>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Upgrade to {pivots.richer.plan.identity.metal_level}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Pay more monthly to reduce your hospital bills.
                            </p>
                        </div>
                    </Link>
                ) : (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 opacity-60">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Max Coverage</span>
                        <div className="font-bold text-slate-500">Highest Tier Reached</div>
                        <p className="text-xs text-slate-400 mt-2">You are viewing the most comprehensive option.</p>
                    </div>
                )}
            </div>
        </div>
    );
}