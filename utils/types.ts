export type MetalLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Catastrophic';
export type NetworkType = 'HMO' | 'PPO' | 'EPO' | 'POS';

export interface FamilyComposition {
    main: number;
    adult: number;
    child: number;
}

export interface BenefitValue {
    copay_amount: number;       // e.g., 30 means $30 copay
    coinsurance_rate: number;   // e.g., 20 means user pays 20%
    subject_to_deductible: boolean; // CRITICAL: If true, user pays FULL PRICE until deductible is met
    limit_text?: string;        // e.g., "First 3 visits only"
}

export interface Plan {
    id: string;
    identity: {
        carrier_name: string;
        plan_marketing_name: string;
        metal_level: MetalLevel;
        network_type: NetworkType;
        quality_rating: number; // 1-5 stars
    };
    financials: {
        premium_gross: number;
        deductible_individual: number;
        deductible_family: number;  // NEW: Family aggregate logic
        moop_individual: number;
        moop_family: number;        // NEW: Family safety net
        hsa_eligible: boolean;
        csr_variant: boolean;
    };
    benefits: {
        // CORE MEDICAL
        primary_care: BenefitValue;
        specialist: BenefitValue;
        urgent_care: BenefitValue;
        emergency_room: BenefitValue;
        telehealth: BenefitValue;   // NEW: The virtual option

        // RX TIERS (Granular)
        rx_tier_1: BenefitValue;    // Generics (Most common)
        rx_tier_2: BenefitValue;    // Preferred Brand (The hidden cost)
        rx_tier_3: BenefitValue;    // Non-Preferred Brand
        rx_tier_4: BenefitValue;    // Specialty (High cost)
    };
    urls: {
        brochure_pdf: string;
        formulary_drug_list: string;
        provider_directory: string;
    };
}