'use client'; 

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'; // FIX: Use absolute path

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
        // 1. Fetch the initial session
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            } catch (error) {
                console.error("Error fetching initial session:", error);
                setSession(null); // Ensure session is null on error
            } finally {
                // 3. Set loading to false *after* the initial check is complete
                setLoading(false);
            }
        };

        fetchSession();

        // 2. Listen for auth state changes (login, logout, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
                // We set loading to false *immediately* on the first fetch,
                // this listener just handles subsequent updates.
                setLoading(false);
            }
        );

        // Cleanup the listener when the component unmounts
        return () => {
             subscription.unsubscribe();
        };
    }, []); // Run this effect only once on mount

    // Memoize the context value to prevent unnecessary re-renders
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