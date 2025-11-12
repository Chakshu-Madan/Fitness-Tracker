// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus } from 'lucide-react';

// Use window.env if available (Vercel injects it)
const supabaseUrl = typeof window !== 'undefined' 
  ? (window as any).ENV?.NEXT_PUBLIC_SUPABASE_URL 
  : process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = typeof window !== 'undefined'
  ? (window as any).ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env vars missing!");
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchWorkouts(data.user.id);
      } else {
        setLoading(false);
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

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center">
        <a href="/" className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold">
          Back to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
      <p className="mb-8">Let's crush it today!</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Pulse</h3>
          <p className="text-3xl font-bold">{workouts.length}</p>
          <p className="text-sm opacity-80">Workouts</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Trophy</h3>
          <p className="text-3xl font-bold">7</p>
          <p className="text-sm opacity-80">Day Streak</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Target</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm opacity-80">km</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Fire</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm opacity-80">Cal</p>
        </div>
      </div>

      <div className="space-y-3">
        {workouts.length === 0 ? (
          <p className="text-center opacity-80">No workouts yet. Tap + to log!</p>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="bg-white bg-opacity-20 rounded-xl p-4">
              <p className="font-semibold">{w.exercise || 'Workout'}</p>
              <p className="text-sm opacity-80">
                {w.sets || 0} × {w.reps || 0} @ {w.weight || 0}kg
              </p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={async () => {
          const exercise = prompt("Exercise?");
          const sets = prompt("Sets?");
          const reps = prompt("Reps?");
          const weight = prompt("Weight (kg)?");

          if (exercise && sets && reps && weight) {
            await supabase.from('workouts').insert({
              user_id: user.id,
              exercise,
              sets: parseInt(sets),
              reps: parseInt(reps),
              weight: parseFloat(weight),
            });
            fetchWorkouts(user.id);
          }
        }}
        className="fixed bottom-8 right-8 bg-white text-purple-600 rounded-full p-4 shadow-lg"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}