'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [error, setError] = useState(null);

  // SAFE: Check env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-600 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Env Vars Missing</h1>
          <p>Check Vercel settings.</p>
        </div>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.log('Session error:', error);
        setError('Auth failed: ' + error.message);
        setLoading(false);
        return;
      }
      if (data.session?.user) {
        setUser(data.session.user);
        fetchWorkouts(data.session.user.id);
      } else {
        // No session - redirect to login
        window.location.href = '/';
      }
    });

    // Listen for auth changes (e.g., after login redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchWorkouts(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWorkouts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWorkouts(data || []);
      setLoading(false);
    } catch (err) {
      setError('Fetch failed: ' + err.message);
      setLoading(false);
    }
  };

  const addWorkout = async (e) => {
    e.preventDefault();
    if (!exercise || sets <= 0 || reps <= 0) {
      setError('Please fill all fields');
      return;
    }

    try {
      const { error } = await supabase.from('workouts').insert({
        user_id: user.id,
        exercise,
        sets,
        reps,
        weight,
      });

      if (error) throw error;
      setExercise(''); setSets(0); setReps(0); setWeight(0);
      setShowForm(false);
      setError(null);
      fetchWorkouts(user.id);
    } catch (err) {
      setError('Save failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-purple-600 text-white p-8">Loading your workouts...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-600 text-white p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
          >
            Retry
          </button>
          <p className="mt-4 text-sm opacity-80">Or <a href="/" className="underline">back to login</a></p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-purple-600 text-white p-8">No session — <a href="/" className="underline">login again</a></div>;
  }

  const totalWorkouts = workouts.length;
  const streak = workouts.filter(w => 
    new Date(w.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome Back, {user.email?.split('@')[0]}!</h1>
      <p className="mb-8">You're on a {streak}-day streak!</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold">Pulse</h3>
          <p className="text-3xl font-bold">{totalWorkouts}</p>
          <p className="text-purple-200">Total Workouts</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold">Trophy</h3>
          <p className="text-3xl font-bold">{streak} days</p>
          <p className="text-purple-200">Current Streak</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold">Target</h3>
          <p className="text-3xl font-bold">0 km</p>
          <p className="text-purple-200">This Week</p>
        </div>
        <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold">Fire</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-purple-200">Calories Burned</p>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
        {workouts.length === 0 ? (
          <p className="text-center text-purple-200 py-8">No workouts yet. Tap + to start your streak!</p>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="bg-white/20 rounded-xl p-4">
              <h3 className="font-semibold text-lg">{w.exercise}</h3>
              <p className="text-sm opacity-80">
                {w.sets} sets × {w.reps} reps @ {w.weight || 0}kg
              </p>
              <p className="text-xs opacity-60 mt-1">
                {new Date(w.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Workout Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-8 right-8 bg-white text-purple-600 rounded-full p-4 shadow-lg hover:bg-purple-100 transition-all duration-200 hover:scale-110"
      >
        +
      </button>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={addWorkout} className="fixed bottom-20 right-6 bg-white/95 text-purple-600 p-6 rounded-2xl shadow-2xl max-w-sm w-full border backdrop-blur-sm">
          <h3 className="font-bold mb-3 text-lg">Log New Workout</h3>
          <input
            type="text"
            placeholder="Exercise (e.g., Push-ups)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="w-full p-3 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="w-full p-3 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-3 border border-purple-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
            step="0.5"
          />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700">
              Save Workout
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(null); }} className="flex-1 bg-gray-300 p-3 rounded-lg font-semibold hover:bg-gray-400">
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </form>
      )}
    </div>
  );
}