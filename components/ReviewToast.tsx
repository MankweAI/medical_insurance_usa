'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, X, Check } from 'lucide-react';
import clsx from 'clsx';

export default function ReviewToast() {
    const [visible, setVisible] = useState(false); // Start hidden
    const [voted, setVoted] = useState(false);

    // Logic: Show toast after 5 seconds of dwelling on the page
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleVote = () => {
        setVoted(true);
        // In production: await supabase.from('analytics').insert({ event: 'helpful_vote' });

        // Auto-dismiss after saying thanks
        setTimeout(() => setVisible(false), 2000);
    };

    if (!visible) return null;

    return (
        <div className={clsx(
            "fixed bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] z-30 transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        )}>
            <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 mx-4 border border-white/10">

                {!voted ? (
                    <>
                        <p className="text-xs font-bold text-slate-200">Did this comparison help you?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleVote}
                                className="p-2 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-full transition-colors active:scale-95"
                            >
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setVisible(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 w-full justify-center text-emerald-400 font-bold text-xs animate-in fade-in zoom-in">
                        <Check className="w-4 h-4" />
                        <span>Thanks for the feedback!</span>
                    </div>
                )}

            </div>
        </div>
    );
}
