// components/ProductGrid.tsx
'use client';

import Card from '@/components/Card';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

interface Product {
  id: string | number;
  title: string;
  price: number;
  image_url: string;
  artist?: {
    username: string;
  };
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const shuffled = useMemo(
    () => [...products].sort(() => 0.5 - Math.random()),
    [products]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {shuffled.map((products) => (
        <Link
          key={products.id}
          href={`/products/${products.id}`}
          className="block relative w-full aspect-[9/10] overflow-hidden group"
        >
          <Card className="h-full">
            <div className="relative w-full h-full">
              <Image
                src={products.image_url}
                alt={products.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-2">
              <h3 className="text-sm font-semibold truncate">
                {products.title}
              </h3>
              {/* 🎨 Artist Credit */}
              {products.artist?.username ? (
                <p className="text-sm text-gray-300">
                  by{' '}
                  <Link
                    href={`/artist/${products.artist.username.toLowerCase()}`}
                    className="text-blue-400 hover:underline"
                  >
                    @{products.artist.username}
                  </Link>
                </p>
              ) : null}
              <p className="text-xs text-pink-300 font-semibold">
                ₱{products.price.toFixed(2)}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
