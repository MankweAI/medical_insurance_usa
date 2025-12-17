import { Plan, BenefitValue } from './types';
import { Persona } from './persona';
import { US_Calculator } from './calculation';

// Assumptions for "Cash Price" of services (if subject to deductible)
const COSTS = {
    PRIMARY_CARE: 150,
    SPECIALIST: 350,
    URGENT_CARE: 250,
    ER: 2500,
    RX_TIER_1: 25,
    RX_TIER_2: 80,
    RX_TIER_3: 200,
    RX_TIER_4: 3500
};

export const PricingEngine = {
    /**
     * Takes a plan and a persona, and returns the customized financial profile.
     */
    runProfile: (plan: Plan, persona: Persona) => {
        // 1. Calculate Subsidy
        const subsidy = US_Calculator.calculateSubsidy(persona);

        // 2. Calculate Net Premium
        const netPremium = Math.max(0, plan.financials.premium_gross - subsidy);
        const annualPremium = netPremium * 12;

        // 3. Calculate "Real Annual Cost" using Usage Profile
        // This is a mini-actuarial simulation
        let accumDeductible = 0;
        let accumMoop = 0;

        const processEvent = (count: number, unitCost: number, benefit: BenefitValue) => {
            for (let i = 0; i < count; i++) {
                if (accumMoop >= plan.financials.moop_individual) continue;

                let patientPay = 0;

                // A. Deductible Phase
                if (benefit.subject_to_deductible) {
                    if (accumDeductible < plan.financials.deductible_individual) {
                        const remainingDed = plan.financials.deductible_individual - accumDeductible;
                        const deductiblePay = Math.min(remainingDed, unitCost);
                        patientPay += deductiblePay;
                        accumDeductible += deductiblePay;
                    }
                }

                // If fully covered by deductible payment? No, deductible payment IS patient pay. 
                // If we paid full unit cost towards deductible, we are done for this event (it was cash price).
                // Unless deductible was met mid-way.

                // Simplified Logic: 
                // If subject to deductible AND deductible not met: Pay Full Cash Price (up to remaining ded).
                // Once deductible met (or if not subject): Pay Copay OR Coinsurance.

                const effectiveCostRemaining = Math.max(0, unitCost - patientPay); // Part paid towards deductible

                if (effectiveCostRemaining > 0) {
                    // Deductible is met or not subject. Apply Copay/Coinsurance.
                    if (accumDeductible >= plan.financials.deductible_individual || !benefit.subject_to_deductible) {
                        let costShare = 0;
                        if (benefit.copay_amount > 0) costShare += benefit.copay_amount;
                        if (benefit.coinsurance_rate > 0) costShare += (effectiveCostRemaining * (benefit.coinsurance_rate / 100));

                        patientPay += costShare;
                    }
                }

                // Cap at MOOP
                const remainingMoop = plan.financials.moop_individual - accumMoop;
                patientPay = Math.min(patientPay, remainingMoop);
                accumMoop += patientPay;
            }
        };

        const u = persona.usage_profile;

        // Run The Simulation
        processEvent(u.annual_doctor_visits, COSTS.PRIMARY_CARE, plan.benefits.primary_care);
        processEvent(u.annual_specialist_visits, COSTS.SPECIALIST, plan.benefits.specialist);
        processEvent(u.annual_urgent_care, COSTS.URGENT_CARE, plan.benefits.urgent_care);

        // Rx
        processEvent(u.prescriptions.tier_1_generics, COSTS.RX_TIER_1, plan.benefits.rx_tier_1);
        processEvent(u.prescriptions.tier_2_preferred, COSTS.RX_TIER_2, plan.benefits.rx_tier_2);
        processEvent(u.prescriptions.tier_3_non_preferred, COSTS.RX_TIER_3, plan.benefits.rx_tier_3);
        processEvent(u.prescriptions.tier_4_specialty, COSTS.RX_TIER_4, plan.benefits.rx_tier_4);

        return {
            grossPremium: plan.financials.premium_gross,
            subsidyApplied: subsidy,
            netPremium: netPremium,
            totalEstimatedCost: Math.floor(annualPremium + accumMoop),
            deductible: plan.financials.deductible_individual
        };
    }
};