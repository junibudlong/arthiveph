'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import useUser from '@/hooks/useUser'; // adjust if yours is named differently

export default function EditProductPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const productId = params?.productId;

  const [product, setProduct] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !data) {
        setError('Product not found.');
        return;
      }

      // Ownership check
      if (data.artist_id !== user?.id) {
        setError('You are not authorized to edit this product.');
        return;
      }

      setProduct(data);
      setTitle(data.title);
      setPrice(data.price);
      setDescription(data.description);
    };

    if (user) fetchProduct();
  }, [productId, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = product.image_url;

    if (image) {
      const ext = image.name.split('.').pop();
      const filePath = `${user.id}-${uuidv4()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, image);

      if (uploadError) {
        setError('Image upload failed.');
        setLoading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      imageUrl = publicData?.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        title,
        price,
        description,
        image_url: imageUrl,
      })
      .eq('id', productId);

    if (updateError) {
      setError('Failed to update product.');
      setLoading(false);
      return;
    }

    router.push(`/products/${productId}`);
  };

  if (isLoading || !user || !product) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <p className="text-white">Title</p>
            <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
            />
        <p className="text-white">Price (₱)</p>
            <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="w-full border px-4 py-2 rounded"
            />
        <p className="text-white">Description</p>
            <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            />
        {/* Current Image */}
        <p className="text-white">Product Images</p>
        {product.image_url && (
          <div className="w-full h-48 relative rounded overflow-hidden border">
            <Image
              src={product.image_url}
              alt="Current product image"
              fill
              className="object-cover"
            />
          </div>
        )}
        {/* Optional Image Upload */}
        <div>
          <label className="block text-sm mb-1">Replace Image (optional):</label>
          <input
            type="file"
            accept="image/*"
            className="border rounded px-2 py-1"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}
