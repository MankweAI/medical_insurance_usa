import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server'; // Ensuring we use the DB version we discussed

const GLOBAL_LAUNCH_DATE = new Date('2025-10-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 🔴 UPDATE THIS LINE
    const baseUrl = 'https://www.intellihealth.co.za';
    const supabase = await createClient();

    // Fetch optimized data
    const { data: rows } = await supabase
        .from('personas')
        .select('slug, data->>updatedAt');

    const staticRoutes = ['', '/about', '/methodology', '/disclaimer', '/privacy'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: GLOBAL_LAUNCH_DATE,
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));

    const personaRoutes = (rows || []).map((row: any) => {
        const slug = row.slug;
        const lastMod = row.updatedAt ? new Date(row.updatedAt) : GLOBAL_LAUNCH_DATE;

        return {
            url: `${baseUrl}/personas/${slug}`,
            lastModified: lastMod,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        };
    });

    return [...staticRoutes, ...personaRoutes];
}