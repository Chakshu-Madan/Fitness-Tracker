import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, RealtimeSubscription } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase'; 

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
        let subscription: RealtimeSubscription | null = null;
        
        // Use an async function to get the initial session *before* listening
        const getInitialSession = async () => {
            // Note: We use try/catch here to handle potential Supabase errors on initial load.
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
                    // Explicitly typing the parameters fixes the 'implicitly any' error
                    setSession(currentSession);
                    setIsAuthReady(true);
                }
            );
            subscription = authSubscription;
        };

        getInitialSession();

        // Cleanup the listener when the component unmounts
        return () => {
             // 2. Safely unsubscribe
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
        loading, // Include the loading state
    }), [session, isAuthReady, loading]);

    // OPTIONAL: If the redirect loop still happens, you might need to enforce 
    // the loading screen here until isAuthReady is true.

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