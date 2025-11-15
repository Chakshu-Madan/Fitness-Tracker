'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useSession } from 'hooks/useSessionContext'; // Adjust path as needed

/**
 * This component is an "Auth Guard".
 * You should wrap your protected pages (like Dashboard) with it.
 * It ensures that a user is authenticated before viewing a page.
 */
export default function Auth({ children }: { children: React.ReactNode }) {
    // Get the session state and, most importantly, the loading state
    const { session, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
        // 1. Wait until the session is fully loaded before checking
        if (loading) {
            return; // Do nothing while loading
        }

        if (!session) {
            router.push('/auth'); // Or your main login page
        }
        
    }, [session, loading, router]); 

   
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-700 text-white text-3xl font-inter">
                Verifying session...
            </div>
        );
    }

    if (session) {
        return <>{children}</>;
    }

    return (
         <div className="flex items-center justify-center min-h-screen bg-purple-700 text-white text-3xl font-inter">
            Redirecting to login...
        </div>
    );
}