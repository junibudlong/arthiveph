'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Product = {
  id: string;
  title: string;
  image_url: string;
  price: number;
  featured?: boolean;
};

export default function Carousel({ featuredProducts }: { featuredProducts: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const product = featuredProducts[currentIndex];

  return (
    <div className="relative w-full h-[400px] bg-white shadow-lg overflow-hidden group">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-700/80 rounded-full shadow hover:bg-white"
        aria-label="Previous"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-700/80 rounded-full shadow hover:bg-white"
        aria-label="Next"
      >
        <FaChevronRight />
      </button>

      {/* Clickable Product */}
      <Link href={`/products/${product.id}`} className="block w-full h-full">
        <div className="flex w-full h-full">
          {/* Image Side */}
          <div className="w-1/2 relative">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="50vw"
              className="object-cover group-hover:scale-105 transition-transform"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>

          {/* Text Side */}
          <div className="w-1/2 flex flex-col justify-center px-10 bg-gradient-to-r from-white via-gray-100 to-blue-50">
            <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>
            <p className="text-lg text-blue-600 mt-2 font-semibold">
              ₱{product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Discover this exclusive item by your favorite artist.
            </p>
          </div>
        </div>
      </Link>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredProducts.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
