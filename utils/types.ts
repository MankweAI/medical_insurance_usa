export type MetalLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Catastrophic';
export type NetworkType = 'HMO' | 'PPO' | 'EPO' | 'POS';

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
        premium_gross: number;     // Full price before subsidy
        deductible_individual: number;
        moop_individual: number;   // Max Out-Of-Pocket
        hsa_eligible: boolean;
        csr_variant: boolean;      // Cost Sharing Reduction variant
    };
    benefits: {
        primary_care_visit: string;
        specialist_visit: string;
        generic_drugs: string;
        specialty_drugs: string;
        emergency_room: string;
    };
    urls: {
        brochure_pdf: string;
        formulary_drug_list: string;
        provider_directory: string;
    };
}