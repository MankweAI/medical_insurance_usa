import { createClient } from '@/utils/supabase/server';
import CompareClient from './CompareClient';
import { Plan } from '@/utils/types';

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ plans?: string }> }) {
    const { plans } = await searchParams;
    const planIds = plans?.split(',') || [];

    if (planIds.length === 0) {
        return <CompareClient plans={[]} />;
    }

    const supabase = await createClient();
    const { data } = await supabase
        .from('plans')
        .select('data')
        .in('id', planIds);

    const resolvedPlans = data?.map(row => row.data as Plan) || [];

    return <CompareClient plans={resolvedPlans} />;
}