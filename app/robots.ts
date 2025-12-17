import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/profile/',
                '/_next/',
            ],
        },
        // 🔴 UPDATE THIS LINE
        sitemap: 'https://www.intellihealth.co.za/sitemap.xml',
    };
}