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