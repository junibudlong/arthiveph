// app/products/[productId]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductDisplay from '@/components/ProductDisplay';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/app/products/[productId]/page.d';

export default async function ProductPage({ params }: PageProps) {
  const { productId } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDisplay product={product} />;
}
