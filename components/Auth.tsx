import { useState } from 'react';
import { supabase } from 'lib/supabase';  // Your client
import { useSession } from '@supabase/auth-helpers-react';  // If using session hook

export default function AuthForm() {
  const [name, setName] = useState('');  // Dynamic state
  const { data: { session } } = useSession();  // Auto-fill from session if logged in
  const user = session?.user;

  // Pre-fill name from user metadata (e.g., on profile edit)
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name);
    } else if (user?.email) {
      setName(user.email.split('@')[0]);  // Fallback: username from email
    }
  }, [user]);

  const handleSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || 'Anonymous Athlete' }  // Store name in metadata
      }
    });
    if (error) toast.error(error.message);
    else toast.success('Signed up! Check email.');
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); /* Call handleSignup */ }}>
      <label htmlFor="name">Full Name (optional for personalized workouts)</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={user ? `Hi, ${user.email?.split('@')[0]}!` : 'Enter your name'}  // Dynamic placeholder
        className="w-full p-2 border rounded"  // Your purple theme CSS
      />
      {/* Other fields: email, password */}
      <button type="submit" className="bg-purple-600 text-white p-2 rounded">Sign Up</button>
    </form>
  );
}