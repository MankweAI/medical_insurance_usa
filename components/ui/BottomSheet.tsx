'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
    const [visible, setVisible] = useState(false);

    // Handle animation timing
    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    // Use Portal to escape parent stacking contexts (z-index traps)
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
            {/* Backdrop (Blur) */}
            <div
                className={clsx(
                    "absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* The Sheet Card */}
            <div
                className={clsx(
                    "relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
                    isOpen ? "translate-y-0 scale-100" : "translate-y-full scale-95"
                )}
                style={{ maxHeight: '90vh' }}
            >
                {/* Drag Handle (Visual cue for mobile) */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 active-press"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto no-scrollbar max-h-[70vh] pb-20 safe-bottom">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

