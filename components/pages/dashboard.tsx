'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'lib/supabase'; // FIX: Corrected path to root
import { useSession } from 'hooks/useSessionContext'; // FIX: Corrected path to root
import { toast, Toaster } from 'sonner';

interface Workout {
    id: string;
    created_at: string;
   
}

export default function Dashboard() {
    // FIX 1: The 'authLoading' property doesn't exist anymore. 
    // We now use 'loading' for the initial state check.
    const { session, loading } = useSession();
    const user = session?.user; // Now correctly pull the user object from the session

    // State for the user's name
    const [displayName, setDisplayName] = useState('Athlete');

    // State for workouts
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    
    // State for total stats (loading state is now handled by the hook's 'loading')
    const [stats, setStats] = useState({ totalWorkouts: 0, distance: 0, calories: 0 });

    // ----------------------------------------------------
    // CRITICAL: The Loading State Check 
    // This stops the infinite refresh/redirect loop by displaying a loading screen 
    // until the authentication check (in useSessionContext.tsx) is complete.
    // ----------------------------------------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-700 text-white text-3xl font-inter">
                Loading your workouts...
            </div>
        );
    }
    // ----------------------------------------------------
    
    // Set user name (from metadata or email fallback)
    useEffect(() => {
        if (user) {
            const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete';
            setDisplayName(name);
            
            // Fetch data only after user is confirmed and loading is complete
            fetchWorkouts(user.id);
        }
    }, [user]);

    // Function to fetch workouts (mock implementation)
    const fetchWorkouts = async (userId: string) => {
        // Here you would implement your Supabase fetch logic:
        // const { data, error } = await supabase.from('workouts').select('*').eq('user_id', userId);
        
        // For now, let's log to ensure we reached this point
        console.log(`Fetching workouts for user: ${userId}`);
        
        // If you need the full implementation of data fetching, let me know!
        
        // Example of setting mock data:
        // setWorkouts(/* your fetched data */);
        // setStats(/* calculate totals from fetched data */);
        
        toast.success(`Welcome back, ${displayName}!`);
    };


    // If 'loading' is false and there is NO user, the AuthGuard/Layout should redirect the user to /auth.
    // Therefore, if we reach this point AND there is a user, we display the dashboard.
    
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-purple-700 mb-6">Welcome back, {displayName}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Workouts" value={stats.totalWorkouts} unit="sessions" />
                <StatCard title="Total Distance" value={stats.distance} unit="km" />
                <StatCard title="Calories Burned" value={stats.calories} unit="kcal" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Recent Activity</h2>
            
            {workouts.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-gray-600">No workouts recorded yet. Start logging your fitness journey!</p>
                </div>
            ) : (
                 // Render workout list here
                 <p>Workouts List Placeholder...</p>
            )}

            <Toaster />
        </div>
    );
}

// Simple Card Component for stats (add this below the Dashboard export)
const StatCard = ({ title, value, unit }: { title: string, value: number, unit: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 transition hover:shadow-xl">
        <p className="text-lg text-gray-500 font-medium">{title}</p>
        <p className="text-4xl font-extrabold text-gray-900 mt-1">{value.toFixed(0)}</p>
        <p className="text-sm text-purple-600 font-semibold">{unit}</p>
    </div>
);