import {
    TaxHousehold,
    InsuranceProduct,
    PlanVariant,
    NetworkCostStructure,
    MonetaryAmount
} from './types'; // Ensure this points to your unified types file

// Helper interface for the simulation
export interface SimulatedClaim {
    memberId: string;
    totalBilled: number;
    allowedAmount: number; // The "Negotiated Rate"
    serviceType: 'PRIMARY_CARE' | 'SPECIALIST' | 'GENERIC_DRUG' | 'SPECIALTY_DRUG' | 'ER';
    networkTier: 'TIER_1_PREFERRED' | 'TIER_2_PARTICIPATING' | 'OUT_OF_NETWORK';
}

export interface SimulationResult {
    totalPremiumAnnual: number;
    totalNetPremiumAnnual: number;
    totalDeductiblePaid: number;
    totalCopayPaid: number;
    totalCoinsurancePaid: number;
    totalMoopPaid: number; // The hard cap check
    grandTotalCost: number; // Premium + Out of Pocket
}

export class ActuarialEngine {

    /**
     * Calculates the Advanced Premium Tax Credit (APTC).
     * Formula: Subsidy = Benchmark_SLCSP - (Household_Income * Applicable_Percentage)
     * Note: This assumes 2024/2025 "American Rescue Plan" expanded subsidies (8.5% cap).
     */
    static calculateMonthlySubsidy(household: TaxHousehold): number {
        if (!household.aptcEligible) return 0;

        // 1. Determine "Applicable Percentage" of income the family is expected to contribute.
        // In a real app, this is a sliding scale lookup table based on FPL %.
        // For this seed, we use a simplified linear interpolation for 2025.
        let expectedContributionPercentage = 0;

        if (household.percentFpl <= 1.5) {
            expectedContributionPercentage = 0.0; // $0 contribution for <150% FPL
        } else if (household.percentFpl <= 2.0) {
            expectedContributionPercentage = 0.02; // ~2% of income
        } else if (household.percentFpl <= 3.0) {
            expectedContributionPercentage = 0.06; // ~6% of income
        } else if (household.percentFpl <= 4.0) {
            expectedContributionPercentage = 0.085; // 8.5% cap
        } else {
            expectedContributionPercentage = 0.085; // Capped at 8.5% for >400% FPL (through 2025)
        }

        // 2. Calculate Expected Monthly Contribution (EMC)
        const monthlyIncome = household.incomeMagi / 12;
        const expectedMonthlyContribution = monthlyIncome * expectedContributionPercentage;

        // 3. Calculate Subsidy
        // Subsidy covers the gap between the Benchmark and what the user can afford.
        const subsidy = household.benchmarkSlcspPremium - expectedMonthlyContribution;

        return Math.max(0, subsidy); // Subsidy cannot be negative
    }

    /**
     * Simulates a year of claims to determine total Out-of-Pocket cost.
     * Handles the "Embedded vs Aggregate" accumulator logic.
     */
    static simulateAnnualCost(
        product: InsuranceProduct,
        variant: PlanVariant,
        household: TaxHousehold,
        claims: SimulatedClaim[]
    ): SimulationResult {

        // 1. Initialize Accumulators
        // Track how much each person has paid towards Deductible and MOOP
        const individualDeductibleAcc: Record<string, number> = {};
        const individualMoopAcc: Record<string, number> = {};

        household.members.forEach(m => {
            individualDeductibleAcc[m.id] = 0;
            individualMoopAcc[m.id] = 0;
        });

        let familyDeductibleAcc = 0;
        let familyMoopAcc = 0;

        let totalDeductiblePaid = 0;
        let totalCopayPaid = 0;
        let totalCoinsurancePaid = 0;

        // 2. Get Network Costs (Assuming Tier 1 for this simulation)
        const tier1Stats = variant.networks.find(n => n.tier === 'TIER_1_PREFERRED');
        if (!tier1Stats) throw new Error("Plan missing Tier 1 Network data");

        const indDedLimit = tier1Stats.deductible.value;
        const famDedLimit = tier1Stats.deductible.value * (tier1Stats.deductibleType === 'EMBEDDED' ? 2 : 1); // Simplified family multiplier
        const indMoopLimit = tier1Stats.moop.value;
        const famMoopLimit = tier1Stats.moop.value * (tier1Stats.moopType === 'EMBEDDED' ? 2 : 1);

        // 3. Process Claims Chronologically
        for (const claim of claims) {
            const memberId = claim.memberId;
            let remainingAllowed = claim.allowedAmount;
            let memberLiabilityForClaim = 0;

            // --- PHASE A: MOOP CHECK (Stop Loss) ---
            // If family MOOP is met, plan pays 100% 
            if (familyMoopAcc >= famMoopLimit) {
                continue; // Next claim, user pays $0
            }
            // If individual MOOP is met (Embedded rule), plan pays 100% for THIS member
            if (tier1Stats.moopType === 'EMBEDDED' && individualMoopAcc[memberId] >= indMoopLimit) {
                continue;
            }

            // --- PHASE B: DEDUCTIBLE ---
            // Determine if deductible is satisfied
            const isIndDedMet = individualDeductibleAcc[memberId] >= indDedLimit;
            const isFamDedMet = familyDeductibleAcc >= famDedLimit;

            let amountToDeductible = 0;

            // Logic: If neither individual nor family deductible is met, user pays.
            // EXCEPTION: If the service has a copay that is "Not Subject to Deductible" (e.g. PCP Visit)
            // For this simplified engine, we assume all claims hit deductible unless strictly specified otherwise.

            if (!isIndDedMet && !isFamDedMet) {
                // Calculate room left in individual deductible
                const roomInInd = indDedLimit - individualDeductibleAcc[memberId];
                // Calculate room left in family deductible
                const roomInFam = famDedLimit - familyDeductibleAcc;

                // The amount strictly applicable to deductible
                const deductibleResolvable = Math.min(remainingAllowed, roomInInd, roomInFam);

                amountToDeductible = deductibleResolvable;

                // Update Accumulators
                individualDeductibleAcc[memberId] += amountToDeductible;
                familyDeductibleAcc += amountToDeductible;

                memberLiabilityForClaim += amountToDeductible;
                remainingAllowed -= amountToDeductible;
                totalDeductiblePaid += amountToDeductible;
            }

            // --- PHASE C: COINSURANCE / COPAY ---
            if (remainingAllowed > 0) {
                // Deductible is met (or was just met), now we pay coinsurance
                const coinsuranceRate = tier1Stats.defaultCoinsurance / 100; // e.g., 0.20
                const coinsuranceAmount = remainingAllowed * coinsuranceRate;

                memberLiabilityForClaim += coinsuranceAmount;
                totalCoinsurancePaid += coinsuranceAmount;
            }

            // --- PHASE D: UPDATE MOOP & CAP LIABILITY ---
            // We calculated potential liability, now we must cap it at the MOOP limit.

            const currentIndMoop = individualMoopAcc[memberId];
            const currentFamMoop = familyMoopAcc;

            const roomInIndMoop = indMoopLimit - currentIndMoop;
            const roomInFamMoop = famMoopLimit - currentFamMoop;

            // The liability cannot exceed available MOOP space
            const actualLiability = Math.min(memberLiabilityForClaim, roomInIndMoop, roomInFamMoop);

            // Update MOOP Accumulators
            individualMoopAcc[memberId] += actualLiability;
            familyMoopAcc += actualLiability;
        }

        // 4. Calculate Final Totals
        const totalMoopPaid = familyMoopAcc; // Total OOP for the family
        const monthlySubsidy = ActuarialEngine.calculateMonthlySubsidy(household);

        // Note: Premium usually depends on age of each member, simplified here to a base rate
        // In a real app, this would sum distinct rates for each member from the Rate PUF.
        const baseMonthlyPremium = 1400; // Placeholder for Family of 4
        const netMonthlyPremium = Math.max(0, baseMonthlyPremium - monthlySubsidy);

        return {
            totalPremiumAnnual: baseMonthlyPremium * 12,
            totalNetPremiumAnnual: netMonthlyPremium * 12,
            totalDeductiblePaid,
            totalCopayPaid, // Simplification: absorbed into coinsurance logic above for brevity
            totalCoinsurancePaid,
            totalMoopPaid,
            grandTotalCost: (netMonthlyPremium * 12) + totalMoopPaid
        };
    }
}