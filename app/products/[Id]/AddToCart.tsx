'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart';

type Props = {
  id: string;
  title: string;
  price: number;
  image_url: string;
};

export default function AddToCart({ id, title, price, image_url }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ id, title, price, image_url }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Quantity:</label>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border rounded px-2 py-1 w-20"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
      {added && <p className="text-green-600 text-sm">Added to cart!</p>}
    </div>
  );
}
