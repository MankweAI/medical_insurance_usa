
import * as fs from 'fs';
import * as path from 'path';

const TARGET_SLUGS = [
    'discovery-smart-classic-risk-funded-2026',
    'discovery-smart-essential-budget-risk-2026',
    'discovery-smart-essential-dynamic-efficiency-2026',
    'discovery-smart-active-ultra-budget-2026',
    'discovery-saver-classic-msa-high-day2day-2026',
    'fedhealth-flexifed3-d2d-plus-health-risk-assessment-savings-unlock-2026',
    'fedhealth-flexifed3-grid-10percent-savings-maternity-family-childhood-benefits-2026',
    'medihelp-medprime-family-large-children-cap-arbitrage-2026',
    'medihelp-medprime-dependent-u26-rate-maximiser-2026',
    'medihelp-medprime-preventive-contraceptive-young-adult-2026',
    'medshield-mediphila-network-copay-avoidance-2026',
    'medshield-mediphila-young-woman-contraception-script-max-2026',
    'momentum-ingwe-connect-starter-2026',
    'sizwehosmed-access-core-non-dsp-usage-penalty-risk-2026',
    'sizwehosmed-access-core-senior-55plus-amd-joint-constraint-2026',
    'bestmed-beat4-savings-daytod-ay-family-comprehensive-2026'
];

const filePath = path.join(__dirname, '../data/personas.ts');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

console.log('--- LOCATIONS ---');

TARGET_SLUGS.forEach(slug => {
    // Find the line with the slug
    // We expect: slug: "the-slug",
    const slugLineIdx = lines.findIndex(line => line.includes(`slug: "${slug}"`));

    if (slugLineIdx === -1) {
        console.log(`❌ Not found: ${slug}`);
        return;
    }

    // Now look forward for 'target_plan_id' or 'mathematical_basis'
    // It should be within the next 50 lines usuall inside actuarial_logic
    let targetPlanLineIdx = -1;
    let mathBasisLineIdx = -1;

    for (let i = slugLineIdx; i < Math.min(slugLineIdx + 60, lines.length); i++) {
        if (lines[i].includes('target_plan_id:')) {
            targetPlanLineIdx = i;
        }
        if (lines[i].includes('mathematical_basis:')) {
            mathBasisLineIdx = i;
        }
    }

    console.log(`Slug: ${slug}`);
    console.log(`  Line: ${slugLineIdx + 1}`);
    if (targetPlanLineIdx !== -1) {
        console.log(`  Target Plan ID Line: ${targetPlanLineIdx + 1}`);
        console.log(`  Content: ${lines[targetPlanLineIdx].trim()}`);
    }
    if (mathBasisLineIdx !== -1) {
        console.log(`  Math Basis Line: ${mathBasisLineIdx + 1}`);
    }
    console.log('');
});
