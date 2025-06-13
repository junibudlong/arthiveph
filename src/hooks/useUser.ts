import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  role: 'user' | 'artist' | 'admin';
  artist_request: boolean;
}

interface UseUserResult {
  user: Profile | null;
  isLoading: boolean;
}

export default function useUser(): UseUserResult {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      console.log('Auth user:', authUser);

      if (!authUser) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, artist_request')
        .eq('id', authUser.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error || 'No profile found. Attempting to create profile...');

        const { error: insertError } = await supabase.from('profiles').insert({
          id: authUser.id,
          role: 'user',
          artist_request: false,
        });

        if (insertError) {
          console.error('Error inserting fallback profile:', insertError);
        } else {
          console.log('Fallback profile inserted.');
        }

        if (isMounted) {
          setUser({
            id: authUser.id,
            role: 'user',
            artist_request: false,
          });
          setIsLoading(false);
        }

        return;
      }

      if (isMounted) {
        setUser(profile);
        setIsLoading(false);
      }
    }

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
