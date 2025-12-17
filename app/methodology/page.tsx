import { ShieldCheck, Calculator, Database, Scale } from 'lucide-react';
import CloseButton from '@/components/CloseButton';

export const metadata = {
    title: 'Actuarial Methodology | Intellihealth',
    description: 'How our algorithms calculate "Effective Cost" and rank medical aid plans based on CMS registered rules.',
};

export default function MethodologyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-6">
            <article className="max-w-3xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 relative">
                <CloseButton />

                <header className="mb-12">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Transparency Report</p>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                        How the "Virtual Actuary" Works
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Intellihealth does not sell ad space. Our rankings are purely mathematical, driven by a proprietary
                        <strong> "Risk-Adjusted Value"</strong> model. Here is exactly how we calculate your results.
                    </p>
                </header>

                <div className="space-y-12">

                    {/* Pillar 1: Data Source */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg"><Database className="w-5 h-5 text-slate-900" /></div>
                            <h2 className="text-xl font-bold text-slate-900">1. The Data Source</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We do not scrape websites. Our data is ingested directly from the official
                            <strong> 2026 Scheme Rules</strong> registered with the <em>Council for Medical Schemes (CMS)</em>.
                        </p>
                        <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                            <li><strong>Accuracy:</strong> Verified against the official brochures of Discovery, Bonitas, and Momentum.</li>
                            <li><strong>Freshness:</strong> Database updated within 48 hours of new rate announcements.</li>
                        </ul>
                    </section>

                    {/* Pillar 2: The Money Engine */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg"><Calculator className="w-5 h-5 text-slate-900" /></div>
                            <h2 className="text-xl font-bold text-slate-900">2. Calculating "Effective Cost"</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Most sites only show the <strong>Premium</strong>. This is misleading. We calculate the
                            <strong> Effective Cost</strong> to show you the true financial impact.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm text-slate-700 my-6">
                            Effective Cost = (Annual Premium) - (Savings Account Allocation) + (Likely Co-Payments)
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            If a plan costs R2,000 but gives you R500 back in savings, we treat the "Sunk Cost" as R1,500.
                            This helps you compare "Apples with Apples."
                        </p>
                    </section>

                    {/* Pillar 3: The Ranking Logic */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg"><Scale className="w-5 h-5 text-slate-900" /></div>
                            <h2 className="text-xl font-bold text-slate-900">3. How We Rank Plans</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Our algorithms penalize plans based on your specific <strong>Persona Risks</strong>:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-xl">
                                <h3 className="font-bold text-rose-900 text-sm mb-2">The "Red Flag" Penalty</h3>
                                <p className="text-xs text-rose-800 leading-relaxed">
                                    If you need "Chronic Care" but a plan restricts meds to State Clinics, we demote that plan by 50 points,
                                    pushing it to the bottom of your feed.
                                </p>
                            </div>
                            <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl">
                                <h3 className="font-bold text-emerald-900 text-sm mb-2">The "Safety" Boost</h3>
                                <p className="text-xs text-emerald-800 leading-relaxed">
                                    Plans with "Above Threshold Benefits" (Safety Nets) receive a ranking boost for families,
                                    even if they are slightly more expensive.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </article>
        </main>
    );
}

