'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FamilyComposition } from '@/utils/types';

interface UserState {
    income: number;
    members: FamilyComposition;
    persona: string | null;
    filters: {
        network: 'Any' | 'Coastal' | 'Network' | 'State' | null;
        chronic: 'None' | 'Basic' | 'Comprehensive' | null;
        savings: 'Yes' | 'No' | null;
        maternity: boolean;
        priority: string | null;
    };
}

interface PersonaContextType {
    state: UserState;
    setIncome: (val: number) => void;
    setMembers: (val: FamilyComposition) => void;
    setPersona: (slug: string) => void;
    setFilter: (key: keyof UserState['filters'], value: any) => void;
    setUnifiedProfile: (persona: any) => void;
    activePersonaPath: string;
    // New Global UI State
    isChatOpen: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<UserState>({
        income: 20000,
        members: { main: 1, adult: 0, child: 0 },
        persona: null,
        filters: {
            network: null,
            chronic: null,
            savings: null,
            maternity: false,
            priority: 'budget'
        }
    });

    // New: Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Hydrate from LocalStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('intellihealth_profile');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const sanitizedMembers = {
                        main: parsed.members?.main || 1,
                        adult: parsed.members?.adults ?? parsed.members?.adult ?? 0,
                        child: parsed.members?.children ?? parsed.members?.child ?? 0
                    };

                    setState(prev => ({
                        ...prev,
                        ...parsed,
                        members: sanitizedMembers,
                        filters: { ...prev.filters, ...parsed.filters }
                    }));
                } catch (e) {
                    console.error("Failed to parse profile", e);
                }
            }
        }
    }, []);

    // Persist to LocalStorage (User Data only, not UI state)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('intellihealth_profile', JSON.stringify(state));
        }
    }, [state]);

    const setIncome = useCallback((val: number) => setState(prev => ({ ...prev, income: val })), []);
    const setMembers = useCallback((val: FamilyComposition) => setState(prev => ({ ...prev, members: val })), []);
    const setPersona = useCallback((slug: string) => setState(prev => ({ ...prev, persona: slug })), []);

    const setFilter = useCallback((key: keyof UserState['filters'], value: any) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, [key]: value }
        }));
    }, []);

    // Atomic update to prevent race conditions on mount
    const setUnifiedProfile = useCallback((persona: any) => {
        setState(prev => ({
            ...prev,
            income: persona.defaults.income,
            members: persona.defaults.family_composition,
            persona: persona.slug,
            filters: {
                ...prev.filters,
                network: persona.search_profile.network_tolerance,
                savings: persona.search_profile.min_savings_allocation > 0 ? 'Yes' : 'No',
                priority: persona.search_profile.priority_tag
            }
        }));
    }, []);

    const activePersonaPath = state.persona
        ? `/personas/${state.persona}?income=${state.income}`
        : '/';

    return (
        <PersonaContext.Provider value={{
            state,
            setIncome,
            setMembers,
            setPersona,
            setFilter,
            setUnifiedProfile,
            activePersonaPath,
            isChatOpen,
            setIsChatOpen
        }}>
            {children}
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const context = useContext(PersonaContext);
    if (!context) throw new Error('usePersona must be used within a PersonaProvider');
    return context;
}