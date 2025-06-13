// app/page.tsx
import { createClient } from '@/utils/supabase/server';
import Carousel from '@/components/Carousel';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 120; 

export default async function HomePage() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image_url, price, featured, artist_id');

  const { data: profiles } = await supabase
  .from('profiles')
  .select('id, username');

  const enrichedProducts = products?.map((product) => ({
    ...product,
    artist: profiles?.find((profile) => profile.id === product.artist_id),
  }));


  if (error) {
    console.error('Error fetching products:', error.message);
    return (
      <main className="text-center py-10">
        <p className="text-red-500 font-semibold">
          Failed to load products. Please try again later.
        </p>
      </main>
    );
  }

  const featuredProducts = enrichedProducts?.filter((p) => p.featured);

  return (
    <main className="max-w-7xl mx-auto">
      <Carousel featuredProducts={featuredProducts || []} />
      <div className="px-4 md:px-6 lg:px-12 py-6"></div>
      <ProductGrid products={enrichedProducts || []} />
    </main>
  );
}
