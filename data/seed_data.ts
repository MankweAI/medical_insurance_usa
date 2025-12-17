import {
    InsuranceProduct,
    TaxHousehold,
    PlanVariant,
    NetworkCostStructure,
    PlanBenefit
} from '../utils/types'; // Adjust import path as needed

// ==========================================
// 1. HELPER: Factory for Cost Structures
// ==========================================
// Creating these manual objects is verbose, so we use a helper to mimic the CMS template structure.

const createSilverVariantStructure = (
    deductible: number,
    moop: number,
    coinsurance: number,
    drudDedIntegrated: boolean
): NetworkCostStructure[] => [
        {
            tier: 'TIER_1_PREFERRED',
            networkId: 'NET-001-HMO',
            deductible: { value: deductible, currency: 'USD' },
            deductibleType: 'EMBEDDED', // Standard ACA Model
            moop: { value: moop, currency: 'USD' },
            moopType: 'EMBEDDED',
            medicalDrugDeductibleIntegrated: drudDedIntegrated,
            defaultCoinsurance: coinsurance, // e.g. 20%
        },
        {
            tier: 'OUT_OF_NETWORK',
            networkId: 'NET-OON',
            deductible: { value: 100000, currency: 'USD' }, // Effectively no coverage
            deductibleType: 'AGGREGATE',
            moop: { value: 0, currency: 'USD' }, // No limit
            moopType: 'AGGREGATE',
            medicalDrugDeductibleIntegrated: true,
            defaultCoinsurance: 100, // Member pays 100%
        }
    ];

const createStandardBenefits = (pcpCopay: number, genDrugCopay: number): PlanBenefit[] => [
    {
        benefitType: 'PRIMARY_CARE_VISIT',
        isCovered: true,
        isEHB: true,
        priorAuthorizationRequired: false,
        deliveryMethod: 'BOTH',
        costSharing: {
            'TIER_1_PREFERRED': {
                type: 'COPAY',
                amount: { value: pcpCopay, currency: 'USD' },
                subjectToDeductible: false, // Copay BEFORE deductible (High value)
                subjectToMoop: true,
                accumulatorAdjustmentProgram: false
            },
            'TIER_2_PARTICIPATING': { type: 'NOT_APPLICABLE', subjectToDeductible: true, subjectToMoop: true, accumulatorAdjustmentProgram: false },
            'OUT_OF_NETWORK': { type: 'NOT_APPLICABLE', subjectToDeductible: true, subjectToMoop: true, accumulatorAdjustmentProgram: false }
        }
    },
    {
        benefitType: 'GENERIC_DRUG',
        isCovered: true,
        isEHB: true,
        formularyTier: 1,
        priorAuthorizationRequired: false,
        costSharing: {
            'TIER_1_PREFERRED': {
                type: 'COPAY',
                amount: { value: genDrugCopay, currency: 'USD' },
                subjectToDeductible: false,
                subjectToMoop: true,
                accumulatorAdjustmentProgram: false
            },
            'TIER_2_PARTICIPATING': { type: 'NOT_APPLICABLE', subjectToDeductible: true, subjectToMoop: true, accumulatorAdjustmentProgram: false },
            'OUT_OF_NETWORK': { type: 'NOT_APPLICABLE', subjectToDeductible: true, subjectToMoop: true, accumulatorAdjustmentProgram: false }
        }
    }
];

// ==========================================
// 2. SEED: Insurance Product (The "Acme Blue Silver")
// ==========================================

export const seedProducts: InsuranceProduct[] = [
    {
        hiosProductId: '12345TX001',
        issuerId: '12345',
        stateCode: 'TX',
        marketType: 'INDIVIDUAL',
        metalLevel: 'SILVER',
        productType: 'HMO',
        networkTemplateId: 'NET-TX-HMO-01',
        formularyId: 'RX-TX-3TIER',
        transparencyInCoverageIndexUrl: 'https://acme-insurance.com/mrf/index.json',
        variants: [
            // 1. STANDARD SILVER (The "Base" Plan)
            // High Deductible ($5,000), High MOOP ($9,100)
            {
                hiosPlanId: '12345TX0010001-01',
                variantType: 'STANDARD_70',
                marketingName: 'Acme Blue Silver HMO',
                avCalculatorOutput: 0.7045,
                rateCurveId: 'RATE-TX-AREA-1',
                isStandardizedPlan: false,
                networks: createSilverVariantStructure(5000, 9100, 40, true),
                benefits: createStandardBenefits(40, 20)
            },
            // 2. CSR 73 (Income 200-250% FPL)
            // Slightly better: Ded $4000, MOOP $7500
            {
                hiosPlanId: '12345TX0010001-04',
                variantType: 'CSR_73',
                marketingName: 'Acme Blue Silver HMO (CSR 73)',
                avCalculatorOutput: 0.7310,
                rateCurveId: 'RATE-TX-AREA-1', // Same Price!
                isStandardizedPlan: false,
                networks: createSilverVariantStructure(4000, 7500, 30, true),
                benefits: createStandardBenefits(30, 15)
            },
            // 3. CSR 87 (Income 150-200% FPL) - THE SWEET SPOT
            // Massive drop: Ded $700, MOOP $3000
            {
                hiosPlanId: '12345TX0010001-05',
                variantType: 'CSR_87',
                marketingName: 'Acme Blue Silver HMO (CSR 87)',
                avCalculatorOutput: 0.8715,
                rateCurveId: 'RATE-TX-AREA-1', // Same Price!
                isStandardizedPlan: false,
                networks: createSilverVariantStructure(700, 3000, 20, true),
                benefits: createStandardBenefits(10, 5)
            },
            // 4. CSR 94 (Income 100-150% FPL) - MEDICAID ALIKE
            // Near zero: Ded $0, MOOP $1000
            {
                hiosPlanId: '12345TX0010001-06',
                variantType: 'CSR_94',
                marketingName: 'Acme Blue Silver HMO (CSR 94)',
                avCalculatorOutput: 0.9405,
                rateCurveId: 'RATE-TX-AREA-1', // Same Price!
                isStandardizedPlan: false,
                networks: createSilverVariantStructure(0, 1000, 10, true),
                benefits: createStandardBenefits(5, 0) // $5 Doc visits, Free generics
            }
        ]
    }
];

// ==========================================
// 3. SEED: Tax Household (The "Target User")
// ==========================================

export const seedHousehold: TaxHousehold = {
    zipCode: '78701', // Austin, TX
    countyFips: '48453', // Travis County
    ratingAreaId: 'TX-AREA-1',

    // Financials: Family of 4 earning $45k/year
    // 2024 FPL for 4 is $31,200. $45k is ~144% FPL.
    // This puts them in the "CSR 94" Bracket.
    incomeMagi: 45000,
    percentFpl: 1.44,

    aptcEligible: true,
    csrEligible: true,
    csrLevel: '94', // This triggers the variant switch

    benchmarkSlcspPremium: 1200, // The reference price for subsidies

    members: [
        {
            id: 'MEM-001',
            age: 45,
            gender: 'M',
            relationshipToSubscriber: 'SELF',
            tobaccoUser: false,
            conditions: ['E11.9'], // Type 2 Diabetes without complications
            hccProfile: {
                model: 'CMS-HCC-V28',
                riskScore: 0.312,
                activeHccs: ['HCC38'], // Diabetes
                interactions: []
            }
        },
        {
            id: 'MEM-002',
            age: 43,
            gender: 'F',
            relationshipToSubscriber: 'SPOUSE',
            tobaccoUser: false,
            conditions: [],
            hccProfile: {
                model: 'CMS-HCC-V28',
                riskScore: 0.0,
                activeHccs: [],
                interactions: []
            }
        },
        {
            id: 'MEM-003',
            age: 12,
            gender: 'M',
            relationshipToSubscriber: 'CHILD',
            tobaccoUser: false,
            conditions: [],
        },
        {
            id: 'MEM-004',
            age: 8,
            gender: 'F',
            relationshipToSubscriber: 'CHILD',
            tobaccoUser: false,
            conditions: [],
        }
    ]
};