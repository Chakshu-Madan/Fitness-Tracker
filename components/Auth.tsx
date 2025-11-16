'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../hooks/useSessionContext'; // FIX: Up two levels

export default function Auth({ children }: { children: React.ReactNode }) {
    const { session, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!session) {
            router.push('/auth');
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