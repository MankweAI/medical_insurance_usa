export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import SinglePlanHero from '@/components/SinglePlanHero';
import StrategyFooter from '@/components/StrategyFooter';
import { SEED_PERSONAS, SEED_PLANS } from '@/data/seed_data';
import { PricingEngine } from '@/utils/engine';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return SEED_PERSONAS.map((persona) => ({
        slug: persona.slug,
    }));
}

// 1. DYNAMIC METADATA
export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const persona = SEED_PERSONAS.find(p => p.slug === params.slug);

    if (!persona) return { title: 'Not Found | HealthOS America' };

    return {
        title: `${persona.meta.title} | 2026 Strategy`,
        description: persona.meta.marketing_hook,
    };
}

// 2. PAGE COMPONENT
export default async function PersonaPage(props: Props) {
    const params = await props.params;
    const { slug } = params;

    // A. FETCH PERSONA FROM SEED DATA
    const persona = SEED_PERSONAS.find(p => p.slug === slug);
    if (!persona) notFound();

    // B. FETCH RECOMMENDED PLAN FROM SEED DATA
    const plan = SEED_PLANS.find(p => p.id === persona.recommended_plan_id);
    if (!plan) return <div>Configuration Error: Recommended Plan Not Found</div>;

    // C. CALCULATE MARKET LADDER (Smart Pivot)
    // We sort all seed plans by "Real Total Cost" to find Cheaper vs Richer options
    const ladder = SEED_PLANS.map(p => {
        const financials = PricingEngine.runProfile(p, persona);
        return {
            plan: p,
            metrics: financials
        };
    }).sort((a, b) => a.metrics.totalEstimatedCost - b.metrics.totalEstimatedCost);

    // D. FIND PIVOTS
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

            <section className="relative z-10 pt-16 px-4 sm:px-6 pb-2">
                {/* WELCOME STATEMENT INLINE (Replacing Component for Phase 3 Simplicity) */}
                <div className="max-w-2xl mx-auto mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">{persona.meta.title}</h1>
                    <p className="text-lg text-slate-600 mt-2">{persona.meta.marketing_hook}</p>
                </div>
            </section>

            {/* THE ONE TRUE ANSWER */}
            <section className="relative z-10 max-w-2xl mx-auto">
                {/* We pass the calculated financials to the Hero */}
                <SinglePlanHero
                    persona={persona}
                    plan={plan}
                    financials={PricingEngine.runProfile(plan, persona)}
                />

                {/* THE STRATEGY FOOTNOTE */}
                <div className="px-4 pb-12 mt-6">
                    <StrategyFooter
                        plan={plan}
                        persona={persona}
                        pivots={pivots}
                    />
                </div>
            </section>
        </main>
    );
}