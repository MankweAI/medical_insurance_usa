/**
 * US HEALTHCARE MARKET DATA TYPES
 * Based on Actuarial Audit for "intellihealth" US Migration.
 * Aligns with CMS QHP Templates, FHIR PlanNet, and ACA V28 Risk Models.
 */

// ==========================================
// 1. Enums & Core Types
// ==========================================

export type MetalLevel =
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | 'CATASTROPHIC'
    | 'EXPANDED_BRONZE';

/**
 * Critical for ACA compliance. 
 * A "Silver" plan is actually 4 different financial products depending on income.
 */
export type PlanVariantType =
    | 'OFF_EXCHANGE'
    | 'STANDARD_70'
    | 'CSR_73'
    | 'CSR_87'
    | 'CSR_94'
    | 'LIMITED_COST_SHARING'
    | 'ZERO_COST_SHARING';

export type NetworkTier =
    | 'TIER_1_PREFERRED'
    | 'TIER_2_PARTICIPATING'
    | 'OUT_OF_NETWORK';

export type AccumulatorType = 'EMBEDDED' | 'AGGREGATE';

export type CostSharingType =
    | 'COPAY'
    | 'COINSURANCE'
    | 'NO_CHARGE'
    | 'NOT_APPLICABLE';

export interface MonetaryAmount {
    value: number;
    currency: 'USD';
}

// ==========================================
// 2. Plan Architecture (The "Product")
// ==========================================

/**
 * Represents a quantitative limit on a benefit (e.g., 20 visits/year).
 * Maps to FHIR BenefitBalance.
 */
export interface QuantitativeLimit {
    value: number;
    unit: 'VISIT' | 'DAY' | 'DOLLAR';
    period: 'CALENDAR_YEAR' | 'LIFETIME' | 'EPISODE';
    isSoftLimit: boolean; // If true, requires Prior Auth to exceed
    sharedGroupIds?: string[]; // IDs of benefit groups this limit applies to (e.g. PT/OT/ST shared limit)
}

/**
 * Detailed cost sharing logic.
 * Handles the "After Deductible" nuance critical for HSA compliance.
 */
export interface CostShareRule {
    type: CostSharingType;
    amount?: MonetaryAmount; // For COPAY
    percent?: number;        // For COINSURANCE (0-100)

    subjectToDeductible: boolean; // Critical flag: Does this apply before or after deductible?
    subjectToMoop: boolean;       // Does member cost count towards MOOP?

    /**
     * Accumulator Adjustment flag.
     * If true, coupons do NOT count towards the member's deductible (CAAP).
     */
    accumulatorAdjustmentProgram: boolean;
}

/**
 * Defines cost sharing for a specific network tier.
 * Aligns with CMS "CopayInnTier1", "CopayInnTier2", "CopayOutofNet".
 */
export interface NetworkCostStructure {
    tier: NetworkTier;
    networkId: string; // Link to Network PUF / FHIR PlanNet

    deductible: MonetaryAmount;
    deductibleType: AccumulatorType; // EMBEDDED vs AGGREGATE

    moop: MonetaryAmount;
    moopType: AccumulatorType; // Almost always EMBEDDED for families per ACA 2016 rule

    /**
     * The "Fourth Hurdle" check.
     * If false, Rx claims do not count towards the main medical deductible.
     */
    medicalDrugDeductibleIntegrated: boolean;
    separateDrugDeductible?: MonetaryAmount;

    // Default cost share for benefits not explicitly overridden
    defaultCoinsurance: number;
}

/**
 * A specific benefit (e.g., Primary Care Visit, Generic Drug).
 * Maps to CMS Benefits & Cost Sharing PUF.
 */
export interface PlanBenefit {
    benefitType: string; // e.g., "PRIMARY_CARE_VISIT", "GENERIC_DRUG"
    isCovered: boolean;
    isEHB: boolean; // Essential Health Benefit flag

    // Cost sharing can vary by network tier
    costSharing: Record<NetworkTier, CostShareRule>;

    limits?: QuantitativeLimit;
    priorAuthorizationRequired: boolean;
    stepTherapyRequired?: boolean; // Specific to pharmacy

    deliveryMethod?: 'IN_PERSON' | 'TELEHEALTH' | 'BOTH'; // New PY2025 requirement

    // Link to formulary if this is a drug benefit
    formularyTier?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * The actual actionable Plan Variant.
 * This represents a specific HIOS ID (14 digits + 2 variant).
 */
export interface PlanVariant {
    hiosPlanId: string; // e.g., 12345TX0010001-01
    variantType: PlanVariantType;
    marketingName: string; // e.g., "Blue Cross Silver 87 HMO"
    avCalculatorOutput: number; // Actuarial Value (e.g., 0.8732)

    // Accumulators
    networks: NetworkCostStructure[];

    // Benefits
    benefits: PlanBenefit[];

    // Premium Pricing pointer (linked to Rating Area)
    rateCurveId: string;

    // Standardized Plan Option Flag
    isStandardizedPlan: boolean;
}

/**
 * The Product container. 
 * Represents the abstract "Silver Plan" before CSR is applied.
 */
export interface InsuranceProduct {
    hiosProductId: string; // 10 digits
    issuerId: string; // 5 digits
    stateCode: string;
    marketType: 'INDIVIDUAL' | 'SMALL_GROUP';
    metalLevel: MetalLevel;
    productType: 'HMO' | 'PPO' | 'EPO' | 'POS';

    // Collection of variants (Standard, 73, 87, 94, etc.)
    variants: PlanVariant[];

    // Links to CMS templates and Transparency Files
    networkTemplateId: string;
    formularyId: string;
    transparencyInCoverageIndexUrl: string; // Link to the Machine Readable File (JSON)
}

// ==========================================
// 3. Persona & Household Logic (The "User")
// ==========================================

export interface HouseholdMember {
    id: string;
    age: number;
    gender: 'M' | 'F';
    relationshipToSubscriber: 'SELF' | 'SPOUSE' | 'CHILD' | 'DEPENDENT';
    tobaccoUser: boolean; // Impacts rating in most states

    // Risk Adjustment Data
    conditions: string[]; // List of ICD-10 Codes
    hccProfile?: {
        model: 'CMS-HCC-V28';
        riskScore: number;
        activeHccs: string[]; // List of triggered HCCs (e.g., "HCC018")
        interactions: string[]; // List of triggered interactions (e.g. "INT_CHF_DIABETES")
        blendedScore?: number; // Weighted average of V24 and V28 for transition years
    };
}

/**
 * Defines the tax unit for APTC/CSR calculation.
 * Necessary because subsidies are based on Household Income, not Individual Income.
 */
export interface TaxHousehold {
    zipCode: string;
    countyFips: string; // Necessary for Rating Area mapping if Zip splits counties
    ratingAreaId: string; // Derived from Zip/County

    incomeMagi: number; // Modified Adjusted Gross Income
    percentFpl: number; // Calculated field: Income / FPL(Year, FamilySize)

    members: HouseholdMember[];

    // Subsidy Eligibility
    aptcEligible: boolean;
    csrEligible: boolean;
    csrLevel?: '73' | '87' | '94'; // Derived from percentFpl

    // Benchmark Data (The reference point for subsidy calc)
    benchmarkSlcspPremium: number;
}

// ==========================================
// 4. Utility Functions (Business Logic)
// ==========================================

/**
 * Determines the Correct Plan Variant for a Household.
 * A user with 140% FPL MUST see the Silver 94 variant, not the Standard Silver.
 */
export function resolvePlanVariant(product: InsuranceProduct, household: TaxHousehold): PlanVariant | undefined {
    // If the household is eligible for CSR, they MUST select a Silver plan to get the variant
    if (product.metalLevel === 'SILVER' && household.csrEligible) {
        switch (household.csrLevel) {
            case '73':
                return product.variants.find(v => v.variantType === 'CSR_73');
            case '87':
                return product.variants.find(v => v.variantType === 'CSR_87');
            case '94':
                return product.variants.find(v => v.variantType === 'CSR_94');
            default:
                // Fallback or error logic
                return product.variants.find(v => v.variantType === 'STANDARD_70');
        }
    }

    // For all other cases (Gold, Bronze, or non-CSR Silver), return Standard or Off-Exchange
    return product.variants.find(v => v.variantType === 'STANDARD_70' || v.variantType === 'OFF_EXCHANGE');
}

// ==========================================
// 5. LEGACY TYPES (DEPRECATED)
// ==========================================

/** 
 * @deprecated Use TaxHousehold members calculation instead
 */
export interface FamilyComposition {
    main: number;
    adult: number;
    child: number;
    seniors?: number;
}

/** 
 * @deprecated Use PlanBenefit instead
 */
export interface BenefitValue {
    name: string;
    value: string; // e.g., "$20" or "20%"
    description?: string;

    // Legacy fields used by utils/format.ts
    subject_to_deductible?: boolean;
    copay_amount?: number;
    coinsurance_rate?: number;
    limit_text?: string;
}

/**
 * @deprecated Use PlanVariant + SimulationResult instead.
 * Kept to unblock legacy components (Compare, Chat) during refactor.
 */
export interface Plan {
    id: string; // e.g. "plan_123"
    plan_name: string; // Legacy field
    carrier_name?: string; // Legacy
    metal_level?: string;

    // Financials
    price: number; // Monthly premium (gross?)
    savings_annual?: number;

    // Legacy Structures
    benefits: {
        primary_care_visit?: string; // "$20"
        specialist_visit?: string;
        generic_drugs?: string;
        emergency_room?: string;
        [key: string]: any;
    };

    // Any other legacy fields used by CompareClient/FeedCard
    financials?: any;
    identity?: any; // For carrier details
    urls?: {
        brochure_pdf?: string;
        provider_directory?: string;
        formulary_drug_list?: string;
    };

    // Mixed bag
    [key: string]: any;
}