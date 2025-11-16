'use client'; 

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';

// FIX: Using absolute path alias, which is standard for Next.js
import { supabase } from '@/lib/supabase'; 

interface SessionContextValue {
    session: Session | null;
    user: User | null;
    loading: boolean; // We will simplify to just 'loading'
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    // Start in loading state
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // 1. Fetch the initial session from storage (this is fast)
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            } catch (error) {
                console.error("Error fetching initial session:", error);
                setSession(null);
            } finally {
                // 3. No matter what, we are "done" with the initial check.
                setLoading(false);
            }
        };

        fetchSession();

        // 2. Then, set up a listener for any *future* changes
        // (e.g., user signs in, signs out, or token refreshes)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
            }
        );

        // Cleanup the listener when the component unmounts
        return () => {
             subscription.unsubscribe();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

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

// Custom hook to consume the session context
export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionContextProvider');
    }
    return context;
};