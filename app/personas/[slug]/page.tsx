// --------------------------------------------------------
// FILE: app/personas/[slug]/page.tsx
// --------------------------------------------------------

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroText from '@/components/HeroText';
import AppHeader from '@/components/AppHeader';
import SinglePlanHero from '@/components/SinglePlanHero';
import StrategyFooter from '@/components/StrategyFooter';
import ControlPanel from '@/components/ControlPanel';
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk';
import BenefitsCard from '@/components/BenefitsCard';

// DATA & LOGIC
import { coreTestScenarios } from '@/data/local-seed-scenarios';
import { seedProducts } from '@/data/seed_data';
import { ActuarialEngine, SimulatedClaim } from '@/utils/engine';
import { resolvePlanVariant } from '@/utils/types';
import { ContentGenerator } from '@/utils/seo-content'; // Might need update or be broken, check later

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return coreTestScenarios.map((s) => ({
        slug: s.slug,
    }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const scenario = coreTestScenarios.find(s => s.slug === params.slug);

    if (!scenario) return { title: 'Not Found | HealthOS America' };

    return {
        title: `${scenario.meta.title} | 2026 Strategy`,
        description: scenario.meta.marketing_hook,
    };
}

export default async function PersonaPage(props: Props) {
    const params = await props.params;
    const { slug } = params;

    // A. FETCH SCENARIO (Household)
    const household = coreTestScenarios.find(s => s.slug === slug);
    if (!household) notFound();

    // B. RESOLVE PLAN (Simulate marketplace logic)
    // For this demo, we assume the user is looking at the "Acme Blue Silver" product
    // and the engine automatically directs them to the correct Variant (e.g. CSR 87).
    const product = seedProducts[0]; // Acme Blue Silver
    const variant = resolvePlanVariant(product, household);

    if (!variant) return <div>Configuration Error: No Valid Plan Variant Found for this Household.</div>;

    // C. RUN ACTUARIAL SIMULATION
    // Simulate a year of "Average" claims to show estimated cost
    // For this seed, we'll create a dummy claim set or just use the household's usage if we added it.
    // Since we don't have usage profiles in `coreTestScenarios` yet, let's simulate a standard set:
    // 2 PCP, 1 Specialist, 2 Generic Rx per person.

    const dummyClaims: SimulatedClaim[] = household.members.flatMap(m => [
        { memberId: m.id, totalBilled: 150, allowedAmount: 100, serviceType: 'PRIMARY_CARE', networkTier: 'TIER_1_PREFERRED' },
        { memberId: m.id, totalBilled: 150, allowedAmount: 100, serviceType: 'PRIMARY_CARE', networkTier: 'TIER_1_PREFERRED' },
        { memberId: m.id, totalBilled: 300, allowedAmount: 200, serviceType: 'SPECIALIST', networkTier: 'TIER_1_PREFERRED' },
        { memberId: m.id, totalBilled: 50, allowedAmount: 20, serviceType: 'GENERIC_DRUG', networkTier: 'TIER_1_PREFERRED' },
        { memberId: m.id, totalBilled: 50, allowedAmount: 20, serviceType: 'GENERIC_DRUG', networkTier: 'TIER_1_PREFERRED' },
    ]);

    // If there is a high risk member (Cancer/Diabetes), add a massive claim
    // Simple hack for the "Catastrophic" test scenario
    household.members.forEach(m => {
        if (m.conditions.length > 0) {
            dummyClaims.push({ memberId: m.id, totalBilled: 50000, allowedAmount: 25000, serviceType: 'ER' as const, networkTier: 'TIER_1_PREFERRED' as const });
        }
    });

    const simulation = ActuarialEngine.simulateAnnualCost(product, variant, household, dummyClaims);
    const subsidyMonthly = ActuarialEngine.calculateMonthlySubsidy(household);

    // D. GENERATE DYNAMIC CONTENT (FAQs) - Placeholder until ContentGen is refactored
    // const faqs = ContentGenerator.generateFAQ(variant, household); 
    const faqs: any[] = [];

    return (
        <main className="min-h-screen bg-slate-50/50 pb-32 relative overflow-hidden animate-page-enter">
            <AppHeader />

            <section className="relative z-10 pt-16 px-4 sm:px-6 pb-8">
                {/* HERO TEXT */}
                <HeroText persona={household} />

                {/* CONTROL PANEL */}
                <ControlPanel />
            </section>

            {/* THE ONE TRUE ANSWER */}
            <section className="relative z-10 max-w-2xl mx-auto px-4">

                {/* 1. HERO CARD */}
                <SinglePlanHero
                    plan={variant}
                    household={household}
                    simulation={simulation}
                    grossPremiumAnnual={simulation.totalPremiumAnnual}
                    subsidyAnnual={subsidyMonthly * 12}
                />

                {/* 2. FULL BENEFIT BREAKDOWN (NEW) */}
                <div className="mt-8">
                    <h3 className="font-bold text-slate-900 text-lg mb-4 px-2">Detailed Coverage Analysis</h3>
                    <BenefitsCard plan={variant} />
                </div>

                {/* 3. STRATEGY FOOTER */}
                <div className="mt-8">
                    {/* Temporarily commented out until StrategyFooter is refactored 
                    <StrategyFooter
                        plan={variant}
                        persona={household}
                        pivots={null}
                    />
                    */}
                </div>

                {/* 4. PEOPLE ALSO ASK */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 text-center">
                        Common Questions for {household.meta.category}s
                    </h3>
                    <PeopleAlsoAsk questions={faqs} />
                </div>
            </section>
        </main>
    );
}