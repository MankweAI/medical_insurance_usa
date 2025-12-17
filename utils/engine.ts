import { Plan } from './types';
import { Persona } from './persona';
import { US_Calculator } from './calculation';

export const PricingEngine = {
    /**
     * Takes a plan and a persona, and returns the customized financial profile.
     */
    runProfile: (plan: Plan, persona: Persona) => {
        // 1. Calculate Subsidy
        const subsidy = US_Calculator.calculateSubsidy(persona);

        // 2. Calculate Net Premium
        const netPremium = Math.max(0, plan.financials.premium_gross - subsidy);

        // 3. Calculate "Real Annual Cost" (The sorting metric)
        const totalEstimatedCost = US_Calculator.calculateTotalCostOfCare(
            plan.financials.premium_gross,
            subsidy,
            plan.financials.deductible_individual,
            persona.meta.category
        );

        return {
            grossPremium: plan.financials.premium_gross,
            subsidyApplied: subsidy,
            netPremium: netPremium,
            totalEstimatedCost: totalEstimatedCost,
            deductible: plan.financials.deductible_individual
        };
    }
};