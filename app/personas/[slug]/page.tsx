// --------------------------------------------------------
// FILE: app/personas/[slug]/page.tsx
// --------------------------------------------------------

// 1. FORCE DYNAMIC RENDER (Crucial for US Logic)
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroText from '@/components/HeroText';
import AppHeader from '@/components/AppHeader';
import SinglePlanHero from '@/components/SinglePlanHero';
import StrategyFooter from '@/components/StrategyFooter';
import ControlPanel from '@/components/ControlPanel'; // <--- FIX 1: Added ControlPanel
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk'; // <--- FIX 2: Added PAA
import BenefitsCard from '@/components/BenefitsCard';

// DATA & LOGIC
import { SEED_PERSONAS, SEED_PLANS } from '@/data/seed_data';
import { PricingEngine } from '@/utils/engine';
import { ContentGenerator } from '@/utils/seo-content'; // <--- Needed for FAQs

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. GENERATE STATIC PARAMS (Fixes 404s)
export async function generateStaticParams() {
    return SEED_PERSONAS.map((persona) => ({
        slug: persona.slug,
    }));
}

// 2. DYNAMIC METADATA
export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const persona = SEED_PERSONAS.find(p => p.slug === params.slug);

    if (!persona) return { title: 'Not Found | HealthOS America' };

    return {
        title: `${persona.meta.title} | 2026 Strategy`,
        description: persona.meta.marketing_hook,
    };
}

// 3. PAGE COMPONENT
export default async function PersonaPage(props: Props) {
    const params = await props.params;
    const { slug } = params;

    // A. FETCH PERSONA
    const persona = SEED_PERSONAS.find(p => p.slug === slug);
    if (!persona) notFound();

    // B. FETCH RECOMMENDED PLAN
    const plan = SEED_PLANS.find(p => p.id === persona.recommended_plan_id);
    if (!plan) return <div>Configuration Error: Recommended Plan Not Found</div>;

    // C. GENERATE DYNAMIC CONTENT (FAQs)
    const faqs = ContentGenerator.generateFAQ(plan, persona);

    // D. CALCULATE MARKET LADDER (Smart Pivot)
    const ladder = SEED_PLANS.map(p => {
        const financials = PricingEngine.runProfile(p, persona);
        return {
            plan: p,
            metrics: financials
        };
    }).sort((a, b) => a.metrics.totalEstimatedCost - b.metrics.totalEstimatedCost);

    // E. FIND PIVOTS
    const currentIndex = ladder.findIndex(item => item.plan.id === plan.id);
    const cheaperOption = currentIndex > 0 ? ladder[currentIndex - 1] : null;
    const richerOption = currentIndex < ladder.length - 1 ? ladder[currentIndex + 1] : null;

    const pivots = {
        cheaper: cheaperOption ? { plan: cheaperOption.plan, persona } : null,
        richer: richerOption ? { plan: richerOption.plan, persona } : null
    };

    return (
        <main className="min-h-screen bg-slate-50/50 pb-32 relative overflow-hidden animate-page-enter">
            <AppHeader />

            <section className="relative z-10 pt-16 px-4 sm:px-6 pb-8">
                {/* HERO TEXT */}
                <HeroText persona={persona} />

                {/* --- FIX 1: CONTROL PANEL INJECTED HERE --- */}
                <ControlPanel />
            </section>

            {/* THE ONE TRUE ANSWER */}
            <section className="relative z-10 max-w-2xl mx-auto px-4">

                {/* 1. HERO CARD */}
                <SinglePlanHero
                    persona={persona}
                    plan={plan}
                    financials={PricingEngine.runProfile(plan, persona)}
                />

                {/* NEW: FULL BENEFIT BREAKDOWN */}
                <div className="mt-8">
                    <h3 className="font-bold text-slate-900 text-lg mb-4 px-2">Detailed Coverage Analysis</h3>
                    <BenefitsCard
                        plan={plan}
                    />
                </div>

                {/* 2. STRATEGY FOOTER */}
                <div className="mt-8">
                    <StrategyFooter
                        plan={plan}
                        persona={persona}
                        pivots={pivots}
                    />
                </div>

                {/* --- FIX 2: PEOPLE ALSO ASK INJECTED HERE --- */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 text-center">
                        Common Questions for {persona.meta.category}s
                    </h3>
                    <PeopleAlsoAsk questions={faqs} />
                </div>
            </section>
        </main>
    );
}