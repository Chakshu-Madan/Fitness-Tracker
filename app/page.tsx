'use client';

import { useSession } from '../hooks/useSessionContext'; // FIX: Up one level
import Link from 'next/link';

export default function Home() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-700 text-white text-3xl font-inter">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-50">
      <h1 className="text-6xl font-bold text-purple-700 mb-8">
        Fitness Tracker
      </h1>
      
      {session ? (
        <div>
          <p className="text-2xl text-gray-700 mb-6">
            Welcome back, {session.user.email}!
          </p>
          <Link href="/dashboard" legacyBehavior>
            <a className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300">
              Go to Your Dashboard
            </a>
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-2xl text-gray-700 mb-6">
            Your journey to a healthier life starts here.
          </p>
          <Link href="/auth" legacyBehavior>
            <a className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300">
              Login or Sign Up
            </a>
          </Link>
        </div>
      )}
    </main>
  );
}