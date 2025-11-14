// components/pages/dashboard.tsx
'use client';                     // <-- important for client-side hooks

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSession } from '@supabase/auth-helpers-react';
import { toast, Toaster } from 'sonner';   // or your toast library

interface Workout {
  id: string;
  created_at: string;
  // add other fields you store
}

export default function Dashboard() {
  // ----- AUTH -----
  const { data: { session } } = useSession();
  const user = session?.user;

  // ----- UI STATE -----
  const [displayName, setDisplayName] = useState('Athlete');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    distance: 0,
    calories: 0,
  });

  // ----- FETCH USER NAME -----
  useEffect(() => {
    if (!user) {
      setDisplayName('Athlete');
      return;
    }

    // 1. Try metadata (set on signup)
    const metaName = user.user_metadata?.full_name;
    if (metaName) {
      setDisplayName(metaName);
      return;
    }

    // 2. Fallback to email prefix
    const emailPart = user.email?.split('@')[0];
    setDisplayName(emailPart ?? 'Athlete');
  }, [user]);

  // ----- FETCH WORKOUTS -----
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setWorkouts(data ?? []);
        setStats(prev => ({
          ...prev,
          totalWorkouts: data?.length ?? 0,
        }));
      } catch (err: any) {
        console.error(err);
        toast.error(`Failed to load workouts: ${err.message}`);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user]);

  // ----- RENDER -----
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-900 text-white">
        Loading workouts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <Toaster />
      <h1 className="mb-6 text-3xl font-bold text-purple-800">
        Welcome back, <span className="underline">{displayName}</span>!
      </h1>

      {/* Stats */}
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

      {/* Workout List */}
      {workouts.length === 0 ? (
        <p className="text-center text-gray-600">
          No workouts yet. Add one to get started!
        </p>
      ) : (
        <div className="space-y-3">
          {workouts.map(w => (
            <div
              key={w.id}
              className="flex justify-between rounded bg-white p-4 shadow"
            >
              <span className="font-medium">
                {new Date(w.created_at).toLocaleDateString()}
              </span>
              {/* add more fields here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}