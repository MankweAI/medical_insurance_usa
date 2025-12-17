// scripts/content-factory.ts
import fs from 'fs';

// 1. RAW DATA (Sample from your Researcher Report)
// In production, you would parse the full CSV/TXT file here.
const RAW_PERSONAS = [
    {
        code: "C_01",
        name: "The ADL Optimizer",
        plan: "Classic Comprehensive",
        math: "Chronic spend > CDL limit",
        intent: "Manage complex chronic conditions like Crohns without copays",
        risk: "ADL formulary restriction changes"
    },
    {
        code: "C_02",
        name: "The Tech Implantee",
        plan: "Classic Comprehensive",
        math: "Procedure cost > R200k",
        intent: "Access insulin pumps or high-cost biologicals",
        risk: "Exceeding the R200k specialized medicine limit"
    },
    {
        code: "S_05",
        name: "The Active Gambler",
        plan: "Active Smart",
        math: "R7,750 Upfront Deductible",
        intent: "Young and healthy, betting against elective surgery to save premium",
        risk: "Knee injury requiring elective scope triggers R7,750 payment"
    },
    {
        code: "K_01",
        name: "The Regional Hub Dweller",
        plan: "KeyCare Start Regional",
        math: "Income < R15,950 + Hub Location",
        intent: "Cheapest private hospital cover in Polokwane or George",
        risk: "Moving address to a non-hub area doubles the premium"
    },
    {
        code: "SS_09",
        name: "The Maternity Planner",
        plan: "Classic Smart Saver",
        math: "Maternity Benefit > MSA spend",
        intent: "Using separate maternity bucket to preserve Savings Account",
        risk: "Scans exceeding the 2D limit are paid from savings"
    }
];

// 2. THE GENERATOR FUNCTIONS

function generateSlug(name: string): string {
    return name.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '') + '-2026';
}

function generateTitle(intent: string): string {
    // Truncate intent if too long for a title
    const coreIntent = intent.split(' ').slice(0, 6).join(' ');
    return `Best Medical Aid to ${coreIntent} | 2026 Strategy`;
}

function generateDescription(intent: string, risk: string, plan: string): string {
    return `Looking to ${intent.toLowerCase()}? Be careful of ${risk.toLowerCase()}. Our algorithm identifies ${plan} as a key strategy for this profile.`;
}

function deriveNeed(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('baby') || t.includes('maternity') || t.includes('pregnant')) return 'maternity';
    if (t.includes('chronic') || t.includes('condition') || t.includes('drug')) return 'chronic';
    if (t.includes('cheap') || t.includes('save') || t.includes('income')) return 'affordability';
    if (t.includes('app') || t.includes('digital') || t.includes('tech')) return 'tech';
    return 'affordability'; // Default
}

function generateSearchProfile(text: string) {
    const t = text.toLowerCase();
    return JSON.stringify({
        minSavings: t.includes('savings') ? 5000 : 0,
        networkTolerance: t.includes('network') ? 'Network' : 'Any',
        mustHaves: t.includes('baby') ? ['private_ward'] : []
    });
}

// 3. EXECUTION LOOP

const sqlStatements = RAW_PERSONAS.map(p => {
    const slug = generateSlug(p.name);
    const title = generateTitle(p.intent);
    const desc = generateDescription(p.intent, p.risk, p.plan);
    const need = deriveNeed(p.intent + p.name);
    const profile = generateSearchProfile(p.intent);

    return `
    INSERT INTO personas (slug, title, description, default_need, search_profile)
    VALUES (
      '${slug}',
      '${title.replace(/'/g, "''")}',
      '${desc.replace(/'/g, "''")}',
      '${need}',
      '${profile}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;
  `;
}).join('\n');

// 4. OUTPUT
console.log("-- AUTO-GENERATED PERSONA SEED --");
console.log(sqlStatements);
