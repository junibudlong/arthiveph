'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem, getCart, removeFromCart, clearCart } from '@/lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. <Link href="/" className="text-blue-600 underline">Browse products</Link></p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="relative w-24 h-24 rounded overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p>₱{item.price.toFixed(2)} × {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-right space-y-4">
            <p className="text-lg font-semibold">Total: ₱{total.toFixed(2)}</p>
            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </main>
  );
}
