import { TaxHousehold } from '../utils/types';

export interface FrontendScenario extends TaxHousehold {
    slug: string;
    meta: {
        title: string;
        marketing_hook: string;
        category: 'Young Invincible' | 'Low Income Family' | 'Chronic Care' | 'High Earner';
    };
    narrative?: {
        problem: string;
        solution: string;
        warning: string;
    };
}

/**
 * THE CORE 5 TEST SCENARIOS
 * Designed to break the app if logic is weak.
 * * 1. The "Free Ride" (CSR 94): Low income, almost $0 costs.
 * 2. The "Trap" (Silver 70): Just barely earns too much for CSR.
 * 3. The "Hybrid Family" (Embedded Logic): 1 sick kid, 3 healthy members.
 * 4. The "High Roller" (No Subsidy): Pays full price.
 * 5. The "Catastrophic" (MOOP Test): Low income, massive medical event.
 */

export const coreTestScenarios: FrontendScenario[] = [
    // 1. THE "FREE RIDE" (CSR 94)
    // Logic Test: Does the app swap the Plan Variant to CSR_94?
    // Math Test: Is Deductible $0?
    {
        slug: 'austin-waitress-csr-maximizer',
        meta: {
            title: 'The Service Industry Saver',
            marketing_hook: 'Why you should never buy a Gold Plan if you earn under $30k.',
            category: 'Low Income Family'
        },
        narrative: {
            problem: 'Income is low, but needs reliable access to doctors for ongoing asthma treatment.',
            solution: 'The Silver CSR plan is a "Secret Gold" plan. Because her income is low, the government forces the Deductible down from $5,000 to $750.',
            warning: 'Do not buy the Bronze plan. The savings on premium ($20/mo) are not worth the risk of a $9,100 deductible.'
        },
        zipCode: '78701',
        countyFips: '48453',
        ratingAreaId: 'TX-AREA-1',
        incomeMagi: 24000,
        percentFpl: 1.18, // < 150% FPL
        aptcEligible: true,
        csrEligible: true,
        csrLevel: '94',
        benchmarkSlcspPremium: 450,
        members: [
            { id: 'TEST-01', age: 28, gender: 'F', relationshipToSubscriber: 'SELF', tobaccoUser: false, conditions: [] }
        ]
    },

    // 2. THE "TRAP" (Standard Silver)
    // Logic Test: Earns $40k (Single), just above CSR 73 cutoff (approx $37k).
    // Math Test: Should see High Deductible ($5k) despite being "Lower Middle Class".
    {
        slug: 'miami-freelancer-healthy',
        meta: {
            title: 'The "Just Missed It" Freelancer',
            marketing_hook: 'Earning $5k too much can cost you $5k in deductibles.',
            category: 'Young Invincible'
        },
        narrative: {
            problem: 'Earns just above the limit for cost-sharing reductions, putting him in a "subsidy cliff" danger zone.',
            solution: 'Consider contributing to a traditional IRA to lower MAGI and qualify for better subsidies.',
            warning: 'If you stay at this income level, the Standard Silver plan has a high $5,000 deductible.'
        },
        zipCode: '78701',
        countyFips: '48453',
        ratingAreaId: 'TX-AREA-1',
        incomeMagi: 42000,
        percentFpl: 2.8, // > 250% FPL (No CSR)
        aptcEligible: true,
        csrEligible: false, // CRITICAL: Must be false
        benchmarkSlcspPremium: 450,
        members: [
            { id: 'TEST-02', age: 35, gender: 'M', relationshipToSubscriber: 'SELF', tobaccoUser: false, conditions: [] }
        ]
    },

    // 3. THE "HYBRID FAMILY" (Embedded Accumulator Test)
    // Logic Test: Dad is Sick (Diabetes), Mom/Kids are Healthy.
    // Math Test: Dad should hit his individual MOOP, family should NOT hit family MOOP.
    {
        slug: 'dallas-tech-family',
        meta: {
            title: 'The Mixed-Risk Family',
            marketing_hook: 'One sick member shouldn\'t bankrupt the whole family.',
            category: 'High Earner'
        },
        narrative: {
            problem: 'Dad has diabetes (high cost), but Mom and Kids are healthy. Aggregate deductibles would punish them.',
            solution: 'Embedded deductibles mean Dad hits his personal cap ($9,100) and insurance kicks in for him, while the rest of the family stays safe.',
            warning: 'Ensure the plan specifically states "Embedded" for Deductible and MOOP.'
        },
        zipCode: '78701',
        countyFips: '48453',
        ratingAreaId: 'TX-AREA-1',
        incomeMagi: 110000,
        percentFpl: 3.5, // CSR Eligible? No. Subsidy Eligible? Yes (capped 8.5%).
        aptcEligible: true,
        csrEligible: false,
        benchmarkSlcspPremium: 1500,
        members: [
            {
                id: 'TEST-03-DAD', age: 45, gender: 'M', relationshipToSubscriber: 'SELF', tobaccoUser: false,
                conditions: ['E11.9'], // Diabetes
                hccProfile: { model: 'CMS-HCC-V28', riskScore: 0.312, activeHccs: ['HCC38'], interactions: [] }
            },
            { id: 'TEST-03-MOM', age: 43, gender: 'F', relationshipToSubscriber: 'SPOUSE', tobaccoUser: false, conditions: [] },
            { id: 'TEST-03-KID1', age: 10, gender: 'M', relationshipToSubscriber: 'CHILD', tobaccoUser: false, conditions: [] },
            { id: 'TEST-03-KID2', age: 8, gender: 'F', relationshipToSubscriber: 'CHILD', tobaccoUser: false, conditions: [] }
        ]
    },

    // 4. THE "HIGH ROLLER" (No Subsidy)
    // Logic Test: Income > 400% (or high enough that contrib > benchmark).
    // Math Test: Net Premium == Gross Premium.
    {
        slug: 'new-york-chronic-care',
        meta: {
            title: 'The High Earner',
            marketing_hook: 'Paying full price? Logic shifts to tax strategy.',
            category: 'High Earner'
        },
        narrative: {
            problem: 'Income is too high for subsidies. Premiums are fully out-of-pocket.',
            solution: 'Look for HSA-eligible plans to use pre-tax dollars for medical expenses, effectively lowering the cost by ~30%.',
            warning: 'Gold plans might feel safer, but check if the premium difference exceeds the deductible difference.'
        },
        zipCode: '78701',
        countyFips: '48453',
        ratingAreaId: 'TX-AREA-1',
        incomeMagi: 250000,
        percentFpl: 8.0,
        aptcEligible: false, // Too rich
        csrEligible: false,
        benchmarkSlcspPremium: 1500,
        members: [
            { id: 'TEST-04', age: 50, gender: 'M', relationshipToSubscriber: 'SELF', tobaccoUser: false, conditions: [] },
            { id: 'TEST-04-SP', age: 50, gender: 'F', relationshipToSubscriber: 'SPOUSE', tobaccoUser: false, conditions: [] }
        ]
    },

    // 5. THE "CATASTROPHIC" (MOOP Safety Net)
    // Logic Test: Low Income + Massive Claim (e.g. Cancer/ER).
    // Math Test: OOP must stop EXACTLY at the MOOP limit.
    {
        slug: 'california-expecting-mom',
        meta: {
            title: 'The Medical Event',
            marketing_hook: 'When you know you will max out.',
            category: 'Chronic Care'
        },
        narrative: {
            problem: 'Facing a major medical event (e.g., Cancer, Surgery, Pregnancy) next year.',
            solution: 'Ignore the Deductible. Focus ENTIRELY on the "Max Out of Pocket" (MOOP). That is your real price.',
            warning: 'A lower premium Bronze plan might actually be vastly more expensive if the MOOP is $2k higher.'
        },
        zipCode: '78701',
        countyFips: '48453',
        ratingAreaId: 'TX-AREA-1',
        incomeMagi: 30000,
        percentFpl: 2.0, // CSR 87 Eligible
        aptcEligible: true,
        csrEligible: true,
        csrLevel: '87',
        benchmarkSlcspPremium: 450,
        members: [
            {
                id: 'TEST-05', age: 29, gender: 'F', relationshipToSubscriber: 'SELF', tobaccoUser: false,
                conditions: ['C50.911'], // Breast Cancer (High Cost)
                hccProfile: { model: 'CMS-HCC-V28', riskScore: 0.85, activeHccs: ['HCC008'], interactions: [] }
            }
        ]
    }
];