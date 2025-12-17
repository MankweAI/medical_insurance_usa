'use client';

import clsx from 'clsx';

interface TrustTickerProps {
    messages: string[];
}

export default function TrustTicker({ messages }: TrustTickerProps) {
    return (
        <div className="h-8 overflow-hidden relative">
            <div className="flex flex-col items-center animate-ticker">
                {messages.map((msg, i) => (
                    <div key={i} className="h-8 flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/60 px-3 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
                        <span className={clsx(
                            "w-2 h-2 rounded-full animate-pulse",
                            i % 2 === 0 ? "bg-emerald-500" : "bg-blue-500"
                        )} />
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    );
}
