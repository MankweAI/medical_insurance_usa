import { TaxHousehold, HouseholdMember } from '../utils/types';

// 1. CONFIGURATION ARRAYS (The "DNA" of your content)
const INCOMES = [
    { label: 'Low', amount: 25000, fplMulti: 1.6 }, // CSR 87
    { label: 'Mid', amount: 45000, fplMulti: 2.9 }, // Standard
    { label: 'High', amount: 95000, fplMulti: 6.0 } // No Subsidy
];

const FAMILIES = [
    { label: 'Single', size: 1, members: ['SELF'] },
    { label: 'Couple', size: 2, members: ['SELF', 'SPOUSE'] },
    { label: 'Family4', size: 4, members: ['SELF', 'SPOUSE', 'CHILD', 'CHILD'] }
];

const CONDITIONS = [
    { label: 'Healthy', code: [], hcc: [], risk: 0.0 },
    { label: 'Diabetes', code: ['E11.9'], hcc: ['HCC38'], risk: 0.312 },
    { label: 'Asthma', code: ['J45'], hcc: ['HCC112'], risk: 0.250 }
];

// 2. THE GENERATOR FUNCTION
export function generateScenarios(): TaxHousehold[] {
    const scenarios: TaxHousehold[] = [];

    // Loop through every combination (3 x 3 x 3 = 27 unique personas)
    INCOMES.forEach(inc => {
        FAMILIES.forEach(fam => {
            CONDITIONS.forEach(cond => {

                // Build the Members
                const members: HouseholdMember[] = fam.members.map((rel, index) => ({
                    id: `MEM-${index}`,
                    age: 35 + (index * 2), // varied ages
                    gender: index % 2 === 0 ? 'M' : 'F',
                    relationshipToSubscriber: rel as any,
                    tobaccoUser: false,
                    // Apply condition ONLY to the subscriber for simplicity in this seed
                    conditions: index === 0 ? cond.code : [],
                    hccProfile: index === 0 && cond.hcc.length > 0 ? {
                        model: 'CMS-HCC-V28',
                        riskScore: cond.risk,
                        activeHccs: cond.hcc,
                        interactions: []
                    } : undefined
                }));

                // Determine CSR Eligibility based on FPL logic
                // (Simplified logic for the generator)
                let csrEligible = false;
                let csrLevel: any = undefined;
                if (inc.fplMulti < 2.5) {
                    csrEligible = true;
                    if (inc.fplMulti < 1.5) csrLevel = '94';
                    else if (inc.fplMulti < 2.0) csrLevel = '87';
                    else csrLevel = '73';
                }

                // Create the valid TaxHousehold object
                const household: TaxHousehold = {
                    zipCode: '78701',
                    countyFips: '48453',
                    ratingAreaId: 'TX-AREA-1',
                    incomeMagi: inc.amount * (fam.size > 1 ? 1.5 : 1), // Adjust income for family size roughly
                    percentFpl: inc.fplMulti,
                    members: members,
                    aptcEligible: true, // Assuming valid citizen
                    csrEligible: csrEligible,
                    csrLevel: csrLevel,
                    benchmarkSlcspPremium: 450 * fam.size // Approx benchmark
                };

                scenarios.push(household);
            });
        });
    });

    return scenarios;
}