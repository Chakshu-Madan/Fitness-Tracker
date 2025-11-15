// components/pages/dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSession } from '@supabase/ssr';
import { toast, Toaster } from 'sonner';

interface Workout {
  id: string;
  created_at: string;
  // add other fields you store
}

export default function Dashboard() {
  const { data: { session } } = useSession();
  const user = session?.user;

  const [displayName, setDisplayName] = useState('Athlete');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalWorkouts: 0, distance: 0, calories: 0 });

  // ----- NAME -----
  useEffect(() => {
    if (!user) {
      setDisplayName('Athlete');
      return;
    }
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Athlete';
    setDisplayName(name);
  }, [user]);

  // ----- WORKOUTS -----
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setWorkouts(data ?? []);
        setStats(s => ({ ...s, totalWorkouts: data?.length ?? 0 }));
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <Toaster />
      <h1 className="mb-6 text-3xl font-bold text-purple-800">
        Welcome back, <span className="underline">{displayName}</span>!
      </h1>

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

      {workouts.length === 0 ? (
        <p className="text-center text-gray-600">No workouts yet.</p>
      ) : (
        <div className="space-y-3">
          {workouts.map(w => (
            <div key={w.id} className="flex justify-between rounded bg-white p-4 shadow">
              <span className="font-medium">
                {new Date(w.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}