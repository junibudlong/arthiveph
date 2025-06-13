// lib/ensureProfile.ts

import { supabase } from './supabase';

export const ensureProfile = async (userId: string, email: string) => {
  const { data, error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      role: 'user', // default role
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  ); // ensures no duplicates on upsert

  if (error) {
    console.error('Error upserting profile:', error);
  }

  return data;
};
