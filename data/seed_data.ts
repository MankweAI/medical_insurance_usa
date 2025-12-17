import { Plan } from '@/utils/types';
import { Persona } from '@/utils/persona';

export const SEED_PLANS: Plan[] = [
    {
        id: 'TX-BCBS-SILVER-CSR',
        identity: {
            carrier_name: 'Blue Cross Blue Shield',
            plan_marketing_name: 'Blue Advantage Silver HMO 205',
            metal_level: 'Silver',
            network_type: 'HMO',
            quality_rating: 4
        },
        financials: {
            premium_gross: 640.00,
            deductible_individual: 750.00,
            deductible_family: 1500.00,
            moop_individual: 2800.00,
            moop_family: 5600.00,
            hsa_eligible: false,
            csr_variant: true
        },
        benefits: {
            primary_care: { copay_amount: 10, coinsurance_rate: 0, subject_to_deductible: false },
            specialist: { copay_amount: 40, coinsurance_rate: 0, subject_to_deductible: false },
            urgent_care: { copay_amount: 45, coinsurance_rate: 0, subject_to_deductible: false },
            emergency_room: { copay_amount: 300, coinsurance_rate: 0, subject_to_deductible: true },
            telehealth: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_1: { copay_amount: 5, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_2: { copay_amount: 25, coinsurance_rate: 0, subject_to_deductible: true },
            rx_tier_3: { copay_amount: 75, coinsurance_rate: 0, subject_to_deductible: true },
            rx_tier_4: { copay_amount: 0, coinsurance_rate: 20, subject_to_deductible: true }
        },
        urls: {
            brochure_pdf: 'https://carrier.com/brochure',
            formulary_drug_list: 'https://carrier.com/rx',
            provider_directory: 'https://carrier.com/docs'
        }
    },
    {
        id: 'FL-OSCAR-BRONZE',
        identity: {
            carrier_name: 'Oscar Health',
            plan_marketing_name: 'Oscar Bronze Classic',
            metal_level: 'Bronze',
            network_type: 'EPO',
            quality_rating: 3
        },
        financials: {
            premium_gross: 390.00,
            deductible_individual: 9100.00,
            deductible_family: 18200.00,
            moop_individual: 9100.00,
            moop_family: 18200.00,
            hsa_eligible: false,
            csr_variant: false
        },
        benefits: {
            primary_care: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false, limit_text: 'First 3 visits $0' },
            specialist: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: true },
            urgent_care: { copay_amount: 75, coinsurance_rate: 0, subject_to_deductible: true },
            emergency_room: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            telehealth: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_1: { copay_amount: 3, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_2: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_3: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_4: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true }
        },
        urls: { brochure_pdf: '', formulary_drug_list: '', provider_directory: '' }
    },
    {
        id: 'NY-UHC-GOLD',
        identity: {
            carrier_name: 'UnitedHealthcare',
            plan_marketing_name: 'UHC Gold Advantage',
            metal_level: 'Gold',
            network_type: 'PPO',
            quality_rating: 5
        },
        financials: {
            premium_gross: 820.00,
            deductible_individual: 1500.00,
            deductible_family: 3000.00,
            moop_individual: 6000.00,
            moop_family: 12000.00,
            hsa_eligible: false,
            csr_variant: false
        },
        benefits: {
            primary_care: { copay_amount: 20, coinsurance_rate: 0, subject_to_deductible: false },
            specialist: { copay_amount: 60, coinsurance_rate: 0, subject_to_deductible: false },
            urgent_care: { copay_amount: 50, coinsurance_rate: 0, subject_to_deductible: false },
            emergency_room: { copay_amount: 400, coinsurance_rate: 0, subject_to_deductible: true },
            telehealth: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_1: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_2: { copay_amount: 50, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_3: { copay_amount: 150, coinsurance_rate: 0, subject_to_deductible: true },
            rx_tier_4: { copay_amount: 250, coinsurance_rate: 0, subject_to_deductible: true }
        },
        urls: { brochure_pdf: '', formulary_drug_list: '', provider_directory: '' }
    },
    {
        id: 'TX-AETNA-HSA',
        identity: {
            carrier_name: 'Aetna CVS Health',
            plan_marketing_name: 'Bronze Deductible Only HSA',
            metal_level: 'Bronze',
            network_type: 'HMO',
            quality_rating: 3
        },
        financials: {
            premium_gross: 410.00,
            deductible_individual: 7500.00,
            deductible_family: 15000.00,
            moop_individual: 7500.00,
            moop_family: 15000.00,
            hsa_eligible: true,
            csr_variant: false
        },
        benefits: {
            primary_care: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            specialist: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            urgent_care: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            emergency_room: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            telehealth: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_1: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_2: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_3: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true },
            rx_tier_4: { copay_amount: 0, coinsurance_rate: 100, subject_to_deductible: true }
        },
        urls: { brochure_pdf: '', formulary_drug_list: '', provider_directory: '' }
    },
    {
        id: 'CA-KAISER-PLATINUM',
        identity: {
            carrier_name: 'Kaiser Permanente',
            plan_marketing_name: 'Platinum 90 HMO',
            metal_level: 'Platinum',
            network_type: 'HMO',
            quality_rating: 5
        },
        financials: {
            premium_gross: 1100.00,
            deductible_individual: 0.00,
            deductible_family: 0.00,
            moop_individual: 1500.00,
            moop_family: 3000.00,
            hsa_eligible: false,
            csr_variant: false
        },
        benefits: {
            primary_care: { copay_amount: 10, coinsurance_rate: 0, subject_to_deductible: false },
            specialist: { copay_amount: 20, coinsurance_rate: 0, subject_to_deductible: false },
            urgent_care: { copay_amount: 20, coinsurance_rate: 0, subject_to_deductible: false },
            emergency_room: { copay_amount: 100, coinsurance_rate: 0, subject_to_deductible: false },
            telehealth: { copay_amount: 0, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_1: { copay_amount: 5, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_2: { copay_amount: 15, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_3: { copay_amount: 30, coinsurance_rate: 0, subject_to_deductible: false },
            rx_tier_4: { copay_amount: 0, coinsurance_rate: 10, subject_to_deductible: false }
        },
        urls: { brochure_pdf: '', formulary_drug_list: '', provider_directory: '' }
    }
];

export const SEED_PERSONAS: Persona[] = [
    {
        slug: 'austin-waitress-csr-maximizer',
        meta: {
            title: 'The Service Industry Saver',
            marketing_hook: 'Why you should never buy a Gold Plan if you earn under $30k.',
            category: 'Low Income Family'
        },
        demographics: {
            zip_code: '78701',
            age: 29,
            household_income: 26000,
            household_size: 1,
            tobacco_user: false
        },
        usage_profile: {
            annual_doctor_visits: 4,
            annual_specialist_visits: 1,
            annual_urgent_care: 0,
            prescriptions: { tier_1_generics: 12, tier_2_preferred: 0, tier_3_non_preferred: 0, tier_4_specialty: 0 }
        },
        subsidy_logic: {
            is_subsidy_eligible: true,
            estimated_tax_credit: 580.00,
            is_csr_eligible: true
        },
        narrative: {
            problem: 'Income is low, but needs reliable access to doctors for ongoing asthma treatment.',
            solution: 'The Silver CSR plan is a "Secret Gold" plan. Because her income is low, the government forces the Deductible down from $5,000 to $750.',
            warning: 'Do not buy the Bronze plan. The savings on premium ($20/mo) are not worth the risk of a $9,100 deductible.'
        },
        recommended_plan_id: 'TX-BCBS-SILVER-CSR'
    },
    {
        slug: 'miami-freelancer-healthy',
        meta: {
            title: 'The "Invincible" Freelancer',
            marketing_hook: 'Catastrophic coverage for the cost of a gym membership.',
            category: 'Young Invincible'
        },
        demographics: {
            zip_code: '33101',
            age: 24,
            household_income: 45000,
            household_size: 1,
            tobacco_user: false
        },
        usage_profile: {
            annual_doctor_visits: 1,
            annual_specialist_visits: 0,
            annual_urgent_care: 0,
            prescriptions: { tier_1_generics: 0, tier_2_preferred: 0, tier_3_non_preferred: 0, tier_4_specialty: 0 }
        },
        subsidy_logic: {
            is_subsidy_eligible: true,
            estimated_tax_credit: 150.00,
            is_csr_eligible: false
        },
        narrative: {
            problem: 'Healthy, rarely sees a doctor, just wants to avoid bankruptcy from a car accident.',
            solution: 'The Oscar Bronze plan is nearly free after subsidies. It includes 3 free doctor visits a year, which is all he needs.',
            warning: 'If you tear your ACL, you will pay $9,100. Ensure you have that in savings.'
        },
        recommended_plan_id: 'FL-OSCAR-BRONZE'
    },
    {
        slug: 'dallas-tech-family',
        meta: {
            title: 'The High-Earning Family',
            marketing_hook: 'Tax deductions over Tax Credits.',
            category: 'High Earner'
        },
        demographics: {
            zip_code: '75001',
            age: 42,
            household_income: 180000,
            household_size: 4,
            tobacco_user: false
        },
        usage_profile: {
            annual_doctor_visits: 6,
            annual_specialist_visits: 2,
            annual_urgent_care: 1,
            prescriptions: { tier_1_generics: 4, tier_2_preferred: 0, tier_3_non_preferred: 0, tier_4_specialty: 0 }
        },
        subsidy_logic: {
            is_subsidy_eligible: false,
            estimated_tax_credit: 0.00,
            is_csr_eligible: false
        },
        narrative: {
            problem: 'They make too much for subsidies, so premiums are painful ($1,600/mo).',
            solution: 'The Aetna HSA plan allows them to pay a lower premium and put $8,300/year into a tax-free investment account (HSA) to lower their taxable income.',
            warning: 'You pay full price for everything until the $7,500 deductible is met. Use your HSA funds wisely.'
        },
        recommended_plan_id: 'TX-AETNA-HSA'
    },
    {
        slug: 'new-york-chronic-care',
        meta: {
            title: 'The Specialist Seeker',
            marketing_hook: 'Access to top-tier specialists without a referral.',
            category: 'Chronic Care'
        },
        demographics: {
            zip_code: '10001',
            age: 55,
            household_income: 90000,
            household_size: 2,
            tobacco_user: false
        },
        usage_profile: {
            annual_doctor_visits: 4,
            annual_specialist_visits: 8,
            annual_urgent_care: 0,
            prescriptions: { tier_1_generics: 12, tier_2_preferred: 4, tier_3_non_preferred: 0, tier_4_specialty: 0 }
        },
        subsidy_logic: {
            is_subsidy_eligible: true,
            estimated_tax_credit: 400.00,
            is_csr_eligible: false
        },
        narrative: {
            problem: 'Needs to see a Cardiologist and Rheumatologist regularly. HMOs require referrals which are annoying.',
            solution: 'The UHC Gold PPO allows direct access to specialists. Higher monthly cost, but lower copays ($60 vs $100) save money in the long run.',
            warning: 'PPO plans are expensive. Ensure your doctors are actually in-network before paying the premium premium.'
        },
        recommended_plan_id: 'NY-UHC-GOLD'
    },
    {
        slug: 'california-expecting-mom',
        meta: {
            title: 'The Maternity Planner',
            marketing_hook: 'Zero deductible for your delivery.',
            category: 'Low Income Family'
        },
        demographics: {
            zip_code: '90210',
            age: 32,
            household_income: 55000,
            household_size: 2,
            tobacco_user: false
        },
        usage_profile: {
            annual_doctor_visits: 12, // Pre-natal
            annual_specialist_visits: 3,
            annual_urgent_care: 0,
            prescriptions: { tier_1_generics: 10, tier_2_preferred: 0, tier_3_non_preferred: 0, tier_4_specialty: 0 }
        },
        subsidy_logic: {
            is_subsidy_eligible: true,
            estimated_tax_credit: 300.00,
            is_csr_eligible: false
        },
        narrative: {
            problem: 'Expecting a baby in 4 months. Delivery costs can be $10,000+.',
            solution: 'The Kaiser Platinum plan has a $0 Deductible. She pays more monthly, but the birth itself will cost almost nothing ($250/day hospital copay).',
            warning: 'Switch to a cheaper plan next year after the baby is born. Platinum is only math-positive for "High Utilization" years.'
        },
        recommended_plan_id: 'CA-KAISER-PLATINUM'
    }
];