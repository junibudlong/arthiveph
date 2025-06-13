'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ensureProfile = async (userId: string) => {
  const { data } = await supabase.from('profiles').select('id').eq('id', userId);

  if (!data || data.length === 0) {
    await supabase.from('profiles').insert([{ id: userId, role: 'user' }]);
  }
};

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await ensureProfile(session.user.id);
        router.push('/profile');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Log in</h1>

        {/* Email + Password Login Form */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          view="sign_in"
          onlyThirdPartyProviders={false}
          providers={[]} // Disable social buttons here
          showLinks={false}
          magicLink={false}
        />

        {/* Separator */}
        <div className="my-6 text-center text-sm text-gray-500">or sign in with</div>

        {/* Google Sign-In Only */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          view="sign_in"
          onlyThirdPartyProviders={true}
          providers={['google']}
        />

        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}
