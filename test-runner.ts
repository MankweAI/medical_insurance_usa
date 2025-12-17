import { seedProducts, seedHousehold } from './data/seed_data';
import { resolvePlanVariant, TaxHousehold, InsuranceProduct, PlanVariant } from './utils/types';
import { ActuarialEngine } from './utils/engine';

/**
 * TEST RUNNER
 * Purpose: Validate the US Actuarial Logic Engine.
 * Scenario: The "Smith Family" (Low Income, High Risk) selects a Silver Plan.
 * Expectation: The engine should auto-select the "CSR 94" variant ($0 Ded) instead of the Standard Silver ($5000 Ded).
 */

function runSimulation() {
    console.log("==================================================");
    console.log("   INTELLIHEALTH US: ACTUARIAL SIMULATION RUN     ");
    console.log("==================================================");

    // 1. LOAD DATA
    const household = seedHousehold;
    const product = seedProducts[0]; // "Acme Blue Silver"

    console.log(`\n[1] HOUSEHOLD PROFILE`);
    console.log(`- Name: Smith Family (Size: ${household.members.length})`);
    console.log(`- Income: $${household.incomeMagi.toLocaleString()} (${(household.percentFpl * 100).toFixed(1)}% FPL)`);
    console.log(`- Risk Factors: Dad has Diabetes (HCC38), Mom is Healthy`);
    console.log(`- Subsidy Eligible: ${household.aptcEligible ? 'YES' : 'NO'}`);

    // 2. RESOLVE PLAN VARIANT
    console.log(`\n[2] PLAN SELECTION LOGIC`);
    console.log(`- Selected Product: ${product.metalLevel} ${product.productType}`);

    const variant = resolvePlanVariant(product, household);

    if (!variant) {
        console.error("CRITICAL ERROR: Could not resolve a plan variant!");
        return;
    }

    console.log(`- LOGIC CHECK: Engine auto-selected variant "${variant.marketingName}"`);
    console.log(`- Variant Type: ${variant.variantType}`);

    // VALIDATION: Should be CSR 94
    if (variant.variantType !== 'CSR_94') {
        console.error("FAIL: Expected CSR_94 for this income level, but got " + variant.variantType);
        console.log("Hint: Check the 'resolvePlanVariant' function in utils/types.ts");
        return;
    } else {
        console.log("PASS: Correctly identified Cost Sharing Reduction (CSR) eligibility.");
    }

    // 3. DEFINE SIMULATED CLAIMS
    // Scenario: Dad needs diabetes management, Kid breaks an arm, Mom gets a checkup.
    const dadId = household.members.find(m => m.relationshipToSubscriber === 'SELF')?.id || 'MEM-001';
    const momId = household.members.find(m => m.relationshipToSubscriber === 'SPOUSE')?.id || 'MEM-002';
    const kidId = household.members.find(m => m.relationshipToSubscriber === 'CHILD')?.id || 'MEM-003';

    console.log(`\n[3] SIMULATING CLAIMS YEAR...`);

    const claims = [
        // CLAIM 1: Dad - Specialist Visit (Endocrinologist)
        // Cost: $300. CSR 94 usually has $0 Deductible, so he pays copay/coinsurance immediately.
        {
            memberId: dadId,
            serviceType: 'SPECIALIST',
            totalBilled: 500,
            allowedAmount: 300, // Negotiated Rate
            networkTier: 'TIER_1_PREFERRED'
        },
        // CLAIM 2: Mom - Annual Wellness Visit (Preventative)
        // ACA Mandate: $0 cost share for preventative.
        // (Note: Our engine simplifies this to standard coinsurance unless we add specific "PREVENTATIVE" logic, 
        // but for this test we'll assume it hits the standard logic to test the math).
        {
            memberId: momId,
            serviceType: 'PRIMARY_CARE',
            totalBilled: 250,
            allowedAmount: 150,
            networkTier: 'TIER_1_PREFERRED'
        },
        // CLAIM 3: Dad - Expensive Medication (Insulin/GLP-1)
        // Cost: $1,200/month (Simulating one fill)
        {
            memberId: dadId,
            serviceType: 'SPECIALTY_DRUG',
            totalBilled: 1500,
            allowedAmount: 1200,
            networkTier: 'TIER_1_PREFERRED'
        },
        // CLAIM 4: Kid - ER Visit (Broken Arm)
        // Cost: $4,000. This tests the MOOP.
        {
            memberId: kidId,
            serviceType: 'ER',
            totalBilled: 6000,
            allowedAmount: 4000,
            networkTier: 'TIER_1_PREFERRED'
        }
    ] as any[]; // Type assertion for brevity in test runner

    console.log(`- Processing ${claims.length} claims totaling $${claims.reduce((acc, c) => acc + c.allowedAmount, 0).toLocaleString()} in allowed amounts...`);

    // 4. EXECUTE ENGINE
    const result = ActuarialEngine.simulateAnnualCost(product, variant, household, claims);

    // 5. REPORT RESULTS
    console.log(`\n[4] FINANCIAL OUTCOME`);
    console.log("--------------------------------------------------");
    console.log(`Gross Premium (Yearly):      $${result.totalPremiumAnnual.toLocaleString()}`);
    console.log(`APTC Subsidy (Yearly):      -$${(result.totalPremiumAnnual - result.totalNetPremiumAnnual).toLocaleString()}`);
    console.log(`NET PREMIUM USER PAYS:       $${result.totalNetPremiumAnnual.toLocaleString()}`);
    console.log("--------------------------------------------------");
    console.log(`Deductibles Paid:            $${result.totalDeductiblePaid.toLocaleString()}`);
    console.log(`Coinsurance Paid:            $${result.totalCoinsurancePaid.toLocaleString()}`);
    console.log(`TOTAL OUT-OF-POCKET:         $${result.totalMoopPaid.toLocaleString()}`);
    console.log("--------------------------------------------------");
    console.log(`GRAND TOTAL COST (Annual):   $${result.grandTotalCost.toLocaleString()}`);
    console.log("--------------------------------------------------");

    // 6. ASSERTIONS
    // The CSR 94 plan has a Family MOOP of roughly $2000-$3000 (very low). 
    // The Kid's ER visit alone ($4000) should have capped out the MOOP.
    // If Total OOP > $3000, something is wrong with the Stop-Loss logic.

    const tier1 = variant.networks.find(n => n.tier === 'TIER_1_PREFERRED');
    const familyMoopLimit = tier1!.moop.value * 2; // Approximate check based on seed logic

    if (result.totalMoopPaid > familyMoopLimit) {
        console.error(`\nFAIL: User paid $${result.totalMoopPaid}, which exceeds the family MOOP of $${familyMoopLimit}!`);
    } else {
        console.log(`\nPASS: Stop-Loss Logic verified. User protected by MOOP ($${result.totalMoopPaid} <= $${familyMoopLimit}).`);
    }
}

// EXECUTE
runSimulation();