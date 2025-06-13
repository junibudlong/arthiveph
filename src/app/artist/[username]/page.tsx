'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function ArtistPage() {
  const params = useParams();
  const username = params?.username as string;
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

console.log('Resolved username param:', username);

useEffect(() => {
  const fetchProfileAndProducts = async () => {
    console.log('Fetching artist profile for:', username);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, bio, avatar_url')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.error('Profile fetch error:', profileError);
      console.log('Queried username:', username);
      setError('Artist not found.');
      return;
    }
    
    if (!profileData) {
        console.log('Profile not found for:', username);
        setError('Artist not found.');
        return;
        }

    setProfile(profileData);

    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, title, price, image_url')
      .eq('artist_id', profileData.id);

    if (productError) console.error('Product fetch error:', productError);

    setProducts(productData || []);
    };

  if (username) fetchProfileAndProducts();
}, [username]);


  if (error) return <p className="p-6 text-center text-red-500">{error}</p>
  if (!profile) return <p className="p-6 text-center">Loading artist profile...</p>


  return (
    <main className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Artist Info */}
      <section className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden relative">
          <Image
            src={profile.avatar_url || '/default-avatar.png'}
            alt={profile.username}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">@{profile.username}</h1>
          <p className="text-gray-600">{profile.bio || 'No bio provided.'}</p>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🎨 Artworks by {profile.username}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="border rounded p-2 hover:shadow transition"
              >
                <div className="relative w-full h-40 mb-2">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
                <h3 className="text-sm font-medium truncate">{product.title}</h3>
                <p className="text-xs text-blue-600 font-semibold">
                  ₱{product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products yet.</p>
        )}
      </section>
    </main>
  )
}
