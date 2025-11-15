'use client'; 

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';

// Using the relative path that works for your structure
import { supabase } from '../lib/supabase'; 

interface SessionContextValue {
    session: Session | null;
    user: User | null;
    isAuthReady: boolean; // This will be true only after the listener has fired once
    loading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    // Start as false. This is the key to fixing the loop.
    const [isAuthReady, setIsAuthReady] = useState(false); 

    useEffect(() => {
        // This listener fires *once* on page load with the initial session,
        // and then again every time the auth state changes.
        // This single source of truth prevents the race condition.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
                // Now we know the auth state is stable and have a definitive answer.
                setIsAuthReady(true); 
            }
        );

        // Cleanup the listener when the component unmounts
        return () => {
             subscription.unsubscribe();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // The app is "loading" until the auth listener has fired at least once.
    const loading = !isAuthReady;

    const value = useMemo(() => ({
        session,
        user: session?.user ?? null,
        isAuthReady,
        loading, 
    }), [session, isAuthReady, loading]);

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