import { Persona } from './persona';

export const US_Calculator = {
    /**
     * Calculates the estimated tax credit (APTC) for a user.
     * LOGIC:
     * 1. If income > 400% FPL, subsidy is limited (historically) but expanded under Inflation Reduction Act.
     * 2. Benchmark Plan (SLCSP) is roughly estimated for this seed phase.
     * 3. Max Contribution is capped at ~8.5% of income.
     */
    calculateSubsidy: (persona: Persona): number => {
        if (!persona.subsidy_logic.is_subsidy_eligible) return 0;

        // 1. Get Monthly Income
        const monthlyIncome = persona.demographics.household_income / 12;

        // 2. Determine "Affordable" Contribution (Simplified to 8.5% of income for 2026)
        // In reality, this scales from 2% to 8.5% based on FPL, but this is our "Seed" logic.
        const maxUserContribution = monthlyIncome * 0.085;

        // 3. Estimate Benchmark Silver Plan Cost (SLCSP) for their age
        // Rule of thumb: Base $450 + Age Load.
        const ageFactor = 1 + ((persona.demographics.age - 21) * 0.03); // Approx 3% increase per year
        const benchmarkPrice = 450 * ageFactor;

        // 4. Calculate Subsidy (Benchmark - MaxContribution)
        let subsidy = benchmarkPrice - maxUserContribution;

        // Subsidy cannot be negative
        return Math.max(0, Math.floor(subsidy));
    },

    /**
     * Calculates the "Real Cost" of a plan.
     * LOGIC: (Monthly Premium * 12) + (Estimated Deductible Usage)
     */
    calculateTotalCostOfCare: (planGrossPremium: number, subsidy: number, deductible: number, riskCategory: string): number => {
        const netPremium = Math.max(0, planGrossPremium - subsidy);
        const annualPremium = netPremium * 12;

        let estimatedUsage = 0;

        // Actuarial Usage Assumptions based on Persona Category
        switch (riskCategory) {
            case 'Chronic Care':
                estimatedUsage = deductible * 1.0; // They will likely hit the full deductible
                break;
            case 'Low Income Family':
                estimatedUsage = deductible * 0.4; // Moderate usage (kids getting sick)
                break;
            case 'Young Invincible':
                estimatedUsage = deductible * 0.1; // Rare usage
                break;
            case 'High Earner':
                estimatedUsage = deductible * 0.2; // Healthy but pays cash for convenience
                break;
            default:
                estimatedUsage = 500; // Base assumption
        }

        return Math.floor(annualPremium + estimatedUsage);
    }
};