import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'INTELLIHEALTH Virtual Actuary',
        short_name: 'INTELLIHEALTH',
        description: 'AI-powered medical aid diagnosis and comparison.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F1F5F9',
        theme_color: '#FFFFFF',
        icons: [
            {
                src: '/intellihealth-favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}

