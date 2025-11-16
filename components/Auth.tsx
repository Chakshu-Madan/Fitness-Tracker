'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // This is correct
import { useSession } from '@/hooks/useSessionContext'; // FIX: Use absolute path

/**
 * This component is an "Auth Guard".
 * You wrap your protected pages (like Dashboard) with it.
 * It ensures that a user is authenticated before viewing a page.
 */
export default function Auth({ children }: { children: React.ReactNode }) {
    const { session, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return; // Do nothing while loading
        }
        if (!session) {
            router.push('/auth'); // Redirect to your login/auth page
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