'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type Colony = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
};

export default function ColoniesPage() {
  const [colonies, setColonies] = useState<Colony[]>([]);

  useEffect(() => {
    const fetchColonies = async () => {
      const { data, error } = await supabase.from('colonies').select('*');
      if (error) {
        console.error('Error fetching colonies:', error.message);
      } else {
        setColonies(data || []);
      }
    };

    fetchColonies();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">🌱 Explore Colonies</h1>

      {colonies.length === 0 ? (
        <p className="text-gray-600">No colonies yet. Stay tuned!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {colonies.map((colony) => (
            <Link
              key={colony.id}
              href={`/colonies/${colony.slug}`}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
                {colony.image_url ? (
                  <Image
                    src={colony.image_url}
                    alt={colony.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold">{colony.name}</h2>
              <p className="text-sm text-gray-600">{colony.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
