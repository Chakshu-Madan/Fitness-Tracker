'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import confetti from 'canvas-confetti';
import { Toaster, toast } from 'sonner';

export default function Dashboard() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [type, setType] = useState('Run');
  const [minutes, setMinutes] = useState('');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    streak: 7,
    distance: 0,
    calories: 0
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchStats(user.id);
    });
  }, []);

  const fetchStats = async (userId) => {
    const { data, count } = await supabase
      .from('workouts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    const totalCalories = data?.reduce((sum, w) => sum + (w.calories || 0), 0) || 0;
    const totalDistance = data?.reduce((sum, w) => sum + (w.distance || 0), 0) || 0;

    setStats({
      totalWorkouts: count || 0,
      streak: 7, // Calculate real streak later
      distance: parseFloat(totalDistance.toFixed(1)),
      calories: totalCalories
    });
  };

  const handleLog = async () => {
    const duration = parseInt(minutes);
    const calories = Math.round(duration * 10);
    const distance = type === 'Run' ? duration * 0.1 : 0;

    await supabase.from('workouts').insert({
      user_id: user?.id,
      type,
      duration_minutes: duration,
      calories,
      distance
    });

    toast.success('Workout logged! Keep going!');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setShowLog(false);
    setMinutes('');
    if (user) fetchStats(user.id);
  };

  // Keep the rest of your dashboard JSX (cards, modal, etc.) EXACTLY as is
  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-xl mb-8">You're on a {stats.streak}-day streak!</p>

          {/* Your cards JSX here - copy from your previous version */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl mb-2">Pulse</div>
              <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
              <div className="text-sm opacity-80">Total Workouts</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl mb-2">Trophy</div>
              <div className="text-3xl font-bold">{stats.streak} days</div>
              <div className="text-sm opacity-80">Current Streak</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl mb-2">Target</div>
              <div className="text-3xl font-bold">{stats.distance} km</div>
              <div className="text-sm opacity-80">This Week</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl mb-2">Fire</div>
              <div className="text-3xl font-bold">{stats.calories}</div>
              <div className="text-sm opacity-80">Calories Burned</div>
            </div>
          </div>

          <button
            onClick={() => setShowLog(true)}
            className="fixed bottom-8 right-8 bg-white text-blue-600 w-16 h-16 rounded-full text-4xl font-bold shadow-2xl hover:scale-110 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {showLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log Workout</h2>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 text-black text-base"
            >
              <option>Run</option>
              <option>Cycle</option>
              <option>Swim</option>
              <option>Yoga</option>
              <option>Weights</option>
            </select>
            <input
              type="number"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full p-3 border rounded-lg mb-6 text-black text-base"
            />
            <div className="flex gap-3">
              <button 
                onClick={handleLog}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button 
                onClick={() => setShowLog(false)}
                className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}