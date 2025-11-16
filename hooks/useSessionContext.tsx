'use client'; 

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase'; // FIX: Correct relative path up two levels

interface SessionContextValue {
    session: Session | null;
    user: User | null;
    loading: boolean; 
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true); // Start as true

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            } catch (error) {
                console.error("Error fetching initial session:", error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
                setLoading(false);
            }
        );

        return () => {
             subscription.unsubscribe();
        };
    }, []);

    const value = useMemo(() => ({
        session,
        user: session?.user ?? null,
        loading, 
    }), [session, loading]);
    
    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionContextProvider');
    }
    return context;
};