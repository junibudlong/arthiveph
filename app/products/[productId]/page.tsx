// app/products/[productId]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound(); // will route to 404
  }

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
          {/* Optionally include buttons or actions here */}
        </div>
      </div>
    </main>
  );
}
