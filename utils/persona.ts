export type PersonaCategory = 'Young Invincible' | 'Low Income Family' | 'Chronic Care' | 'High Earner';

export interface Persona {
    slug: string;
    meta: {
        title: string;
        marketing_hook: string;
        category: PersonaCategory;
    };
    demographics: {
        zip_code: string;
        age: number;
        household_income: number;
        household_size: number;
        tobacco_user: boolean;
    };
    // NEW: Usage Profile (What do they actually consume?)
    usage_profile: {
        annual_doctor_visits: number;
        annual_specialist_visits: number;
        annual_urgent_care: number;
        prescriptions: {
            tier_1_generics: number; // Scripts per year
            tier_2_preferred: number;
            tier_3_non_preferred: number;
            tier_4_specialty: number;
        };
    };
    subsidy_logic: {
        is_subsidy_eligible: boolean;
        estimated_tax_credit: number;
        is_csr_eligible: boolean;
    };
    narrative: {
        problem: string;
        solution: string;
        warning: string;
    };
    recommended_plan_id: string;
}