'use client';

import Image from 'next/image';
import Link from 'next/link';
import useUser from '@/hooks/useUser'; 
import { useEffect, useState } from 'react';
import AddToCart from '@/app/products/[productId]/AddToCart';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  description?: string;
  artist_id: string;
}

export default function ProductDisplay({ product }: { product: Product }) {
  const { user } = useUser();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user?.id && product.artist_id === user.id) {
      setIsOwner(true);
    }
  }, [user, product.artist_id]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to All Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl text-blue-700 font-semibold">
            ₱{product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 pt-4">
            {product.description || 'No description available.'}
          </p>
          <AddToCart
            id={product.id}
            title={product.title}
            price={product.price}
            image_url={product.image_url}
          />
          {isOwner && (
            <Link
              href={`/products/${product.id}/edit`}
              className="text-sm inline-block bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              ✏️ Edit Product
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
