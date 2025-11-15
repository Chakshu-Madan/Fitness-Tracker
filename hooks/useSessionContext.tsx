import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase'; 

interface SessionContextValue {
    session: Session | null;
    user: User | null;
    isAuthReady: boolean; 
    loading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // Starts as false

    useEffect(() => {
        let subscription: Subscription | null = null;
        
        const getInitialSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
            } catch (error) {
                console.error("Error fetching initial Supabase session:", error);
                setSession(null); // Ensure session is null on error
            }
            
            setIsAuthReady(true);
            
            const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
                (event: AuthChangeEvent, currentSession: Session | null) => {
                    setSession(currentSession);
                    setIsAuthReady(true);
                }
            );
            subscription = authSubscription;
        };

        getInitialSession();

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
        loading, // Include the loading state
    }), [session, isAuthReady, loading]);


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