'use client'; 

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase'; // Using absolute path alias

interface SessionContextValue {
    session: Session | null;
    user: User | null;
    isAuthReady: boolean; 
    loading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// This component listens to Supabase auth changes and provides global session state
export function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // Starts as false

    useEffect(() => {
        let subscription: Subscription | null = null;
        
        // Use an async function to get the initial session *before* listening
        const getInitialSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
            } catch (error) {
                console.error("Error fetching initial Supabase session:", error);
                setSession(null); // Ensure session is null on error
            }
            
            setIsAuthReady(true);
            
            // 1. Listen for auth changes and set the session after initial check
            const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
                (event: AuthChangeEvent, currentSession: Session | null) => {
                    setSession(currentSession);
                    setIsAuthReady(true);
                }
            );
            subscription = authSubscription;
        };

        getInitialSession();

        // Cleanup the listener when the component unmounts
        return () => {
             if (subscription) {
                 subscription.unsubscribe();
             }
        };
    }, []);

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