import { Plan } from '@/utils/types';
import { Persona } from '@/utils/persona';

export const ContentGenerator = {

    generateGlossary: (plan: Plan) => {
        const terms = [];

        // 1. Network Type Definition
        if (plan.identity.network_type === 'HMO') {
            terms.push({
                term: "HMO (Health Maintenance Org)",
                definition: "A strict network. You MUST stay in-network to get coverage (except emergencies). You usually need a referral from your primary doctor to see a specialist."
            });
        } else if (plan.identity.network_type === 'PPO') {
            terms.push({
                term: "PPO (Preferred Provider Org)",
                definition: "Flexible network. You can see any doctor you want. Staying on the list is cheaper, but you still get some money back if you go out-of-network. No referrals needed."
            });
        } else if (plan.identity.network_type === 'EPO') {
            terms.push({
                term: "EPO (Exclusive Provider Org)",
                definition: "A hybrid. Like an HMO, you have NO coverage out-of-network. But like a PPO, you generally don't need referrals to see specialists."
            });
        }

        // 2. HSA Eligibility
        if (plan.financials.hsa_eligible) {
            terms.push({
                term: "HSA Eligible",
                definition: "This plan unlocks a 'Health Savings Account'. You can put up to $4,150 (individual) or $8,300 (family) into a bank account tax-free to pay for medical bills."
            });
        }

        // 3. Deductible Explanation
        if (plan.financials.deductible_individual > 5000) {
            terms.push({
                term: "High Deductible",
                definition: `You are responsible for the first $${plan.financials.deductible_individual.toLocaleString('en-US')} of bills. This keeps your monthly premium low, but you must have savings ready for accidents.`
            });
        } else if (plan.financials.deductible_individual === 0) {
            terms.push({
                term: "Zero Deductible",
                definition: "The insurance company starts paying immediately. You only pay small co-pays for services, but your monthly premium is much higher."
            });
        }

        return terms.slice(0, 3);
    },

    generateFAQ: (plan: Plan, persona: Persona) => {
        const faqs = [];

        // Q1: The "Why" (Persona Logic)
        faqs.push({
            question: `Why is the ${plan.identity.metal_level} tier recommended for the '${persona.meta.category}' profile?`,
            answer: persona.narrative.solution
        });

        // Q2: The "Hidden Cost" (Deductible vs Co-pay)
        if (plan.benefits.primary_care.subject_to_deductible) {
            faqs.push({
                question: "Do I have to pay the full price to see a doctor?",
                answer: "Yes, initially. Because this plan charges 'After Deductible' for GP visits, you will pay the full cash rate (approx. $150-$200) until you reach your deductible amount."
            });
        } else {
            const copay = plan.benefits.primary_care.copay_amount > 0 ? `$${plan.benefits.primary_care.copay_amount}` : '$0';
            faqs.push({
                question: "How much is a standard doctor's visit?",
                answer: `You pay a flat fee of ${copay}, even if you haven't met your deductible yet. This is a 'Pre-Deductible' benefit.`
            });
        }

        // Q3: The "Tax Credit" (Subsidy Logic)
        if (persona.subsidy_logic.is_subsidy_eligible) {
            faqs.push({
                question: "Will I have to pay this subsidy back to the IRS?",
                answer: "Potentially. If your income ends up being higher than the $ " + persona.demographics.household_income.toLocaleString('en-US') + " you estimated, you may have to repay some of the tax credit when you file your 2026 tax return."
            });
        }

        return faqs;
    }
};