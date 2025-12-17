'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CloseButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 active:scale-95 transition-all z-10"
            aria-label="Close"
        >
            <X className="w-5 h-5" />
        </button>
    );
}
