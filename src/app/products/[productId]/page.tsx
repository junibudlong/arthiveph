// src/app/products/[productId]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductDisplay from '@/components/ProductDisplay';
import { notFound } from 'next/navigation';

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
    notFound();
  }

  return <ProductDisplay product={product} />;
}
