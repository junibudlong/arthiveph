'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function ColonyPage() {
  const { slug } = useParams();
  const [colony, setColony] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColonyAndProducts = async () => {
      const { data: colonyData, error: colonyError } = await supabase
        .from('colonies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (colonyError || !colonyData) {
        setError('Colony not found.');
        return;
      }

      setColony(colonyData);

      const { data: productData, error: productError } = await supabase
        .from('product_colony')
        .select('product_id, products(id, title, price, image_url)')
        .eq('colony_id', colonyData.id);

      if (productError) {
        console.error('Error fetching products:', productError.message);
      } else {
        const extracted = productData.map((entry: any) => entry.products);
        setProducts(extracted);
      }
    };

    fetchColonyAndProducts();
  }, [slug]);

  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!colony) return <p className="p-6 text-center">Loading colony...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        {colony.image_url && (
          <div className="relative w-full h-64 rounded overflow-hidden mb-4">
            <Image
              src={colony.image_url}
              alt={colony.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-blue-700">{colony.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{colony.description}</p>
      </div>

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🛒 Products in this Colony</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded p-2 bg-white hover:shadow"
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
        )}
      </section>
    </main>
  );
}
