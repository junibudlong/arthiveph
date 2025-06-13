'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [message] = useState('');
  const [error] = useState('');
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Move outside useEffect for stable reference
  const ensureProfile = useCallback(
    async (userId: string) => {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId);

      if (!existingProfile || existingProfile.length === 0) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: userId,
            role: 'user',
            username,
            bio,
            avatar_url: null, // Add later in profile page
          },
        ]);

        if (insertError) {
          console.error('Error inserting profile:', insertError.message);
        }
      }
    },
    [username, bio]
  );

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await ensureProfile(session.user.id);
        router.push('/profile');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [ensureProfile, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password || !username) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (isAvailable === false) {
      setFormError('Username is already taken.');
      return;
    }

    if (formError) return;

    setSubmitting(true);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (signupError) {
      if (signupError.message.toLowerCase().includes('already registered')) {
      setFormError('An account with this email already exists.');
      } else {
        setFormError(signupError?.message || 'Signup failed.');
      }
      setSubmitting(false);
      return;
    }

    const user = signupData.user;

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user?.id,
      username,
      bio,
      avatar_url: '',
    });

    if (profileError) {
      setFormError('Failed to create profile.');
      setSubmitting(false);
      return;
    }

    alert('Signup successful!');
    setSubmitting(false);
  };

  useEffect(() => {
    const delayCheck = setTimeout(async () => {
      if (!email) {
        setCheckingEmail(false);
        return;
      }

        setCheckingEmail(true);
        const { data } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .maybeSingle(); // avoids throw if not found

        setCheckingEmail(false);
        if (data) {
          setFormError('Email already in use.');
        } else {
          setFormError(null);
        }
      }, 500);

      return () => clearTimeout(delayCheck);
    }, [email]);

    useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!username) {
        setIsAvailable(null);
        return;
      }

    setCheckingUsername(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking username:', error.message);
      setIsAvailable(null);
    } else {
      setIsAvailable(!data); // ✅ available if no row found
    }

    setCheckingUsername(false);
  }, 500); // ⏱ debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [username]);


  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-4 py-2 rounded"
        />
        <p className="text-sm mt-1">
          {checkingEmail && <span className="text-gray-500">Checking availability...</span>}
          {!checkingEmail && isAvailable === true && (
            <span className="text-green-600">✅ Email is available for use!</span>
          )}
          {!checkingUsername && isAvailable === false && (
            <span className="text-red-600">❌ Email is already registerd.</span>
          )}
        </p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            const raw = e.target.value;
            const cleaned = raw
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '');
            setUsername(cleaned);
          }}
          required
          className="border px-4 py-2 rounded"
        />
        <p className="text-sm text-gray-500 mt-1">
          Only lowercase letters, numbers, hyphens (-), and underscores (_) allowed for usernames.
        </p>
        <p className="text-sm mt-1">
          {checkingUsername && <span className="text-gray-500">Checking availability...</span>}
          {!checkingUsername && isAvailable === true && (
            <span className="text-green-600">✅ Username is available</span>
          )}
          {!checkingUsername && isAvailable === false && (
            <span className="text-red-600">❌ Username is already taken</span>
          )}
        </p>
        <textarea
          placeholder="Bio (Optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        {formError && <p className="text-red-600 text-sm">{formError}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting || checkingUsername || checkingEmail || isAvailable === false}
        >
          {submitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="my-6 text-center text-sm text-gray-500">or sign up with</div>

      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        view="sign_up"
        onlyThirdPartyProviders
        providers={['google']}
        redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined}
      />
    </main>
  );
}
