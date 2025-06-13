// app/products/[productId]/page.tsx
import { supabase } from '@/lib/supabase';
import ProductDisplay from '@/components/ProductDisplay';


interface PageProps {
  params: { productId: string };
}

export default async function ProductPage({ params }: PageProps) {
  const { productId } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return <p className="p-6 text-red-600">Product not found.</p>;
  }

  return <ProductDisplay product={product} />
  ;
}
