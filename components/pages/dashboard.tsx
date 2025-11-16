'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // FIX: Use absolute path
import { useSession } from '@/hooks/useSessionContext'; // FIX: Use absolute path
import { toast, Toaster } from 'sonner';

interface Workout {
    id: string;
    created_at: string;
    // Add other fields
}

export default function Dashboard() {
    const { session, loading } = useSession(); // No change needed here
    const user = session?.user; 

    const [displayName, setDisplayName] = useState('Athlete');
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [stats, setStats] = useState({ totalWorkouts: 0, distance: 0, calories: 0 });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-700 text-white text-3xl font-inter">
                Loading your workouts...
            </div>
        );
    }
    
    useEffect(() => {
        if (user) {
            const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete';
            setDisplayName(name);
            fetchWorkouts(user.id, name); // Pass name to toast
        }
    }, [user]);

    const fetchWorkouts = async (userId: string, name: string) => {
        // You can add your Supabase fetch logic here
        
        // Show a welcome toast
        toast.success(`Welcome back, ${name}!`);
    };

    
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
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    {workouts.map(workout => (
                        <div key={workout.id} className="border-b last:border-b-0 py-2">
                            <p className="text-gray-800">Workout on {new Date(workout.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                 </div>
            )}
            <Toaster />
        </div>
    );
}

const StatCard = ({ title, value, unit }: { title: string, value: number, unit: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 transition hover:shadow-xl">
        <p className="text-lg text-gray-500 font-medium">{title}</p>
        <p className="text-4xl font-extrabold text-gray-900 mt-1">{value.toFixed(0)}</p>
        <p className="text-sm text-purple-600 font-semibold">{unit}</p>
    </div>
);