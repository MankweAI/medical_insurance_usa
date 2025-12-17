'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan } from '@/utils/types';

// Re-export for compatibility with consumers
export type { Plan };

interface CompareContextType {
    activePin: Plan | null;
    pinnedHistory: Plan[];
    showPinnedOnly: boolean;
    setPin: (plan: Plan) => void;
    clearPin: () => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
    togglePinnedView: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [activePin, setActivePin] = useState<Plan | null>(null);
    const [pinnedHistory, setPinnedHistory] = useState<Plan[]>([]);
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedHistory = localStorage.getItem('healthos_pin_history');
                const savedActive = localStorage.getItem('healthos_active_pin');

                if (savedHistory) {
                    const parsed = JSON.parse(savedHistory);
                    // Simple check: does the first item have the new 'identity' structure?
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].identity) {
                        setPinnedHistory(parsed);
                    } else {
                        // Data is stale/incompatible, clear it
                        localStorage.removeItem('healthos_pin_history');
                    }
                }

                if (savedActive) {
                    const parsed = JSON.parse(savedActive);
                    if (parsed && parsed.identity) {
                        setActivePin(parsed);
                    } else {
                        localStorage.removeItem('healthos_active_pin');
                    }
                }
            } catch (e) {
                console.error("Failed to hydrate comparison context:", e);
                // Fail safe: clear corrupted storage
                localStorage.removeItem('healthos_pin_history');
                localStorage.removeItem('healthos_active_pin');
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('healthos_pin_history', JSON.stringify(pinnedHistory));
            if (activePin) {
                localStorage.setItem('healthos_active_pin', JSON.stringify(activePin));
            } else {
                localStorage.removeItem('healthos_active_pin');
            }
        }
    }, [pinnedHistory, activePin]);

    const setPin = (plan: Plan) => {
        setActivePin(plan);
        setPinnedHistory(prev => {
            const others = prev.filter(p => p.id !== plan.id);
            return [plan, ...others];
        });
    };

    const clearPin = () => setActivePin(null);

    const removeFromHistory = (id: string) => {
        setPinnedHistory(prev => prev.filter(p => p.id !== id));
        if (activePin?.id === id) setActivePin(null);
    };

    const clearHistory = () => {
        setPinnedHistory([]);
        setActivePin(null);
    };

    const togglePinnedView = () => setShowPinnedOnly(prev => !prev);

    return (
        <CompareContext.Provider value={{
            activePin,
            pinnedHistory,
            showPinnedOnly,
            setPin,
            clearPin,
            removeFromHistory,
            clearHistory,
            togglePinnedView
        }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) throw new Error('useCompare must be used within a CompareProvider');
    return context;
}