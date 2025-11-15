// components/pages/dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';  // For Session type
import { toast, Toaster } from 'sonner';

interface Workout {
  id: string;
  created_at: string;
  // Add other fields like name, distance, calories if you have them
}

// Custom useSession hook (since @supabase/ssr doesn't export one)
function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export default function Dashboard() {
  const { session, loading: authLoading } = useSession();
  const user = session?.user;

  const [displayName, setDisplayName] = useState('Athlete');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalWorkouts: 0, distance: 0, calories: 0 });

  // Set user name (from metadata or email fallback)
  useEffect(() => {
    if (!user) {
      setDisplayName('Athlete');
      return;
    }
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete';
    setDisplayName(name);
  }, [user]);

  // Fetch workouts (only for logged-in user)
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)  // Secure: only user's data
          .order('created_at', { ascending: false });

        if (error) throw error;

        setWorkouts(data ?? []);
        setStats(prev => ({
          ...prev,
          totalWorkouts: data?.length ?? 0,
          // Update distance/calories if your table has those fields, e.g., data.reduce((sum, w) => sum + (w.distance || 0), 0)
        }));
      } catch (error: any) {
        console.error('Error fetching workouts:', error);
        toast.error(`Failed to load workouts: ${error.message}`);
        setWorkouts([]);
      } finally {
        setLoading(false);  // Always reset to exit purple loading screen
      }
    };

    fetchWorkouts();
  }, [user]);

  // Combined loading (auth + data)
  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-900 text-white">
        Loading workouts...
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <Toaster />
      <h1 className="mb-6 text-3xl font-bold text-purple-800">
        Welcome back, <span className="underline">{displayName}!</span>
      </h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total Workouts</p>
          <p className="text-2xl font-semibold">{stats.totalWorkouts}</p>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Distance (km)</p>
          <p className="text-2xl font-semibold">{stats.distance}</p>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Calories</p>
          <p className="text-2xl font-semibold">{stats.calories}</p>
        </div>
      </div>

      {/* Workouts List */}
      {workouts.length === 0 ? (
        <p className="text-center text-gray-600">
          No workouts yet. <button onClick={() => window.location.reload()}>Add one!</button>
        </p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div key={workout.id} className="flex justify-between rounded bg-white p-4 shadow">
              <span className="font-medium">
                {new Date(workout.created_at).toLocaleDateString()}
              </span>
              {/* Add workout details here, e.g., <span>{workout.name} - {workout.distance}km</span> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}