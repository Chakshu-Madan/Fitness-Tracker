// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchWorkouts(data.user.id);
      }
    });
  }, []);

  const fetchWorkouts = async (userId: string) => {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setWorkouts(data || []);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
      <p className="text-purple-200 mb-8">You're on a {workouts.length > 0 ? 'fire' : 'new'} streak!</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white">Pulse</h3>
          <p className="text-3xl font-bold text-white">{workouts.length}</p>
          <p className="text-purple-200">Total Workouts</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white">Trophy</h3>
          <p className="text-3xl font-bold text-white">7 days</p>
          <p className="text-purple-200">Current Streak</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white">Target</h3>
          <p className="text-3xl font-bold text-white">0 km</p>
          <p className="text-purple-200">This Week</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white">Fire</h3>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-purple-200">Calories Burned</p>
        </div>
      </div>

      {/* WORKOUT LIST */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <p className="text-center text-purple-200">No workouts yet. Tap + to log one!</p>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="bg-white bg-opacity-20 rounded-xl p-4 text-white">
              <p className="font-semibold">{w.exercise}</p>
              <p className="text-sm text-purple-200">
                {w.sets} sets × {w.reps} reps @ {w.weight}kg
              </p>
              <p className="text-xs text-purple-300">
                {new Date(w.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          const exercise = prompt("Exercise?");
          const sets = prompt("Sets?");
          const reps = prompt("Reps?");
          const weight = prompt("Weight (kg)?");

          if (exercise && sets && reps && weight) {
            supabase
              .from('workouts')
              .insert({
                user_id: user.id,
                exercise,
                sets: parseInt(sets),
                reps: parseInt(reps),
                weight: parseFloat(weight),
              })
              .then(() => fetchWorkouts(user.id));
          }
        }}
        className="fixed bottom-8 right-8 bg-white text-purple-600 rounded-full p-4 shadow-lg hover:scale-110 transition"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}