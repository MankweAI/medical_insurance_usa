import { BenefitValue } from './types';

export const formatBenefit = (benefit: BenefitValue): string => {
    if (!benefit) return 'Not Covered';

    const parts = [];

    // 1. DEDUCTIBLE CHECK
    if (benefit.subject_to_deductible) {
        parts.push('Deductible then');
    }

    // 2. COST
    if (benefit.copay_amount === 0 && benefit.coinsurance_rate === 0) {
        parts.push('$0');
    } else {
        if (benefit.copay_amount > 0) {
            parts.push(`$${benefit.copay_amount} Copay`);
        }
        if (benefit.coinsurance_rate > 0) {
            parts.push(`${benefit.coinsurance_rate}% Co-insurance`);
        }
    }

    // 3. LIMITS (Append at the end)
    if (benefit.limit_text) {
        return `${parts.join(' ')} (${benefit.limit_text})`;
    }

    return parts.join(' ');
};
