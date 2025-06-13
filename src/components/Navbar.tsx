'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import useUser from '@/hooks/useUser';
import { supabase, requestArtist } from '@/lib/supabase';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow relative">
      <Link href="/" className="text-xl font-bold text-blue-600">
        ArtHivePH
      </Link>

      <div className="flex items-center space-x-4">
        {/* Shopping Cart */}
        <Link href="/cart" className="text-gray-700 hover:text-blue-600 text-xl">
          <FaShoppingCart />
        </Link>

        {/* Login button when not authenticated */}
        {!isLoading && !user && (
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login/Signup
          </Link>
        )}

        {/* Admin Dashboard link */}
        {user?.role === 'admin' && (
          <Link href="/admin" className=" text-black px-4 py-2 hover:bg-gray-300 rounded-2xl">
            Admin Dashboard
          </Link>
        )}

        {/* Always show menu toggle */}
        <div className="relative">
          <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 text-xl">
            <FaBars />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-50">
              {user ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>

                  {user.role === 'user' && !user.artist_request && (
                    <button
                      onClick={async () => {
                        const err = await requestArtist(user.id);
                        if (!err) alert('Your request has been sent!');
                        else alert('Oops, please try again.');
                      }}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Become an Artist
                    </button>
                  )}
                  {user.artist_request && (
                    <span className="block px-4 py-2 text-gray-500">Artist request pending…</span>
                  )}
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 text-gray-500 italic">Not logged in</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
