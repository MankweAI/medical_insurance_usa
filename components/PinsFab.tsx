'use client';

import { MapPin, X, Filter } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function PinsFab() {
    const { pinnedHistory, togglePinnedView, showPinnedOnly } = useCompare();
    const [isMounted, setIsMounted] = useState(false);

    // HYDRATION FIX: Wait until component mounts on client before rendering
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything on the server or if no pins exist
    if (!isMounted || pinnedHistory.length === 0) return null;

    return (
        <button
            onClick={togglePinnedView}
            className={clsx(
                "fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full shadow-xl flex items-center gap-2 active:scale-95 transition-all border",
                showPinnedOnly
                    ? "bg-blue-600 text-white border-blue-500 shadow-blue-900/30"
                    : "bg-slate-900 text-white border-slate-700 shadow-slate-900/30"
            )}
        >
            {showPinnedOnly ? <Filter className="w-4 h-4" /> : <MapPin className="w-4 h-4 fill-white" />}
            <span className="text-xs font-bold">
                {showPinnedOnly ? `Show All` : `${pinnedHistory.length} Pinned`}
            </span>
        </button>
    );
}