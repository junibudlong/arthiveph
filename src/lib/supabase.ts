//temporary add
console.log(
  '❯ Supabase URL:',
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  '   Key:',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + '…'
);

// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts() {
  const { data, error } = await supabase
  .from('products')
  .select(`
    id,
    title,
    price,
    image_url,
    featured,
  `);
  if (error) throw error;
  return data;
}

export async function requestArtist(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ artist_request: true })
    .eq('id', userId);
  return error;
}
