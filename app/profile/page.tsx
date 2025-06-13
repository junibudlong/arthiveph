'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import useUser from '@/hooks/useUser';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [artistRequest, setArtistRequest] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editBio, setEditBio] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username); // prefill with current
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoading) return;
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role, artist_request, created_at, username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching profile:', error?.message);
        router.push('/login');
        return;
      }

      setRole(data.role);
      setRole(data.role);
      setArtistRequest(data.artist_request);
      setUsername(data.username);
      setBio(data.bio);
      setAvatarUrl(data.avatar_url);
      setLoading(false);
    };

    fetchProfile();
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user || role !== 'artist') return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('artist_id', user.id);

      if (error) {
        console.error('Error fetching your products:', error.message);
      } else {
        setMyProducts(data);
      }
    };

    fetchMyProducts();
  }, [user, role]);

  const handleUpdate = async (field: string, value: string | null) => {
    if (!user) return;
    await supabase.from('profiles').update({ [field]: value }).eq('id', user.id);
  };

  const handleArtistRequest = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ artist_request: true })
      .eq('id', user.id);
    if (!error) setArtistRequest(true);
  };

  const handleAvatarUpload = async () => {
    if (!user || !avatarFile) return;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${user.id}-${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return;
    }

    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (!publicData?.publicUrl) {
      console.error('Failed to get public URL.');
      return;
    }

    await supabase.from('profiles').update({ avatar_url: publicData.publicUrl }).eq('id', user.id);
    setAvatarUrl(publicData.publicUrl);
  };

  if (isLoading || loading) {
    return <p className="text-center p-6">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center p-6">Redirecting...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        { /* Header Section */}
        <div className="flex flex-col items-center gap-1">
          {/* Avatar */}
          <div className="relative w-24 h-24 mb-2">
        <div className="relative w-full h-full rounded-full overflow-hidden border border-gray-300 shadow">
          {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          fill
          className="object-cover"
        />
          ) : (
        <span className="flex items-center justify-center h-full w-full text-white font-bold text-2xl bg-gray-400">
          {user.id?.charAt(0).toUpperCase()}
        </span>
          )}
        </div>
        { /* Edit Avatar Button */}
        <button
          onClick={() => setShowAvatarUploader(true)}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 text-gray-500 text-xs px-2 py-1 rounded shadow hover:bg-blue-100"
        >
          ⇄
        </button>
          </div>
        {/* Username */}
      <div className="flex items-center gap-2">
          {isEditingUsername ? (
        <input
          type="text"
          value={newUsername ?? ''}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full mt-1"
        />
        
          ) : (
        <p className="text-3xl font-semibold text-gray-800 mt-1">@{username}</p>
          )}
          {isEditingUsername ? (
        <>
          <button
        onClick={async () => {
          if (newUsername?.trim() === '' || newUsername === username) return;
          setIsSavingUsername(true);
          const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
          setIsSavingUsername(false);

          if (!error) {
        setIsEditingUsername(false);
        setUsername(newUsername);
          } else {
        alert('Failed to update username.');
          }
        }}
        disabled={newUsername === username || isSavingUsername}
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
        Save
          </button>
          <button
        onClick={() => {
          setIsEditingUsername(false);
          setNewUsername(username);
        }}
        className="text-gray-500 text-sm hover:underline"
          >
        Cancel
          </button>
        </>
          ) : (
        <button
          onClick={() => setIsEditingUsername(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" 
          fill="none" xmlns="http://www.w3.org/2000/svg"> 
          <path d="M13 21H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
          <path fillRule="evenodd" clipRule="evenodd" d="M18.0235 10.4646L7.58554 20.9026H2.76801L2.76489 16.0819L13.2029 5.64392L18.0235 10.4646Z" 
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
          <path d="M13.2029 5.64388L15.0004 3.84641C15.7814 3.06536 17.0477 3.06536 17.8288 3.84641L19.821 5.83863C20.6021 6.61968 20.6021 7.88601 19.821 8.66706L18.0235 10.4645V10.4645" 
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </svg>
        </button>
          )}
          </div>
          <p className="text-l font-normal text-gray-800 mt-1 capitalize">
          {role || 'user'}
          </p>
      </div>
        <div className="p-6 space-y-4">
          {/* Artist Request Button */}
          {role === 'user' && !artistRequest && (
        <section>
          <button
        onClick={handleArtistRequest}
        className="right bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
        Become an Artist
          </button>
        </section>
          )}
          {role === 'user' && artistRequest && (
        <section>
          <p className="text-sm italic text-gray-500">Artist request pending approval…</p>
        </section>
          )}
          {/* Bio */}
          <section>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-m font-semibold text-black">Bio</h2>
          <button
        onClick={() => setEditBio(true)}
        className="text-sm text-blue-600"
        aria-label="Edit Bio"
        type="button"
          >
        <svg width="15" height="15" viewBox="0 0 24 24"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 21H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path fillRule="evenodd" clipRule="evenodd" d="M18.0235 10.4646L7.58554 20.9026H2.76801L2.76489 16.0819L13.2029 5.64392L18.0235 10.4646Z"
        stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.2029 5.64388L15.0004 3.84641C15.7814 3.06536 17.0477 3.06536 17.8288 3.84641L19.821 5.83863C20.6021 6.61968 20.6021 7.88601 19.821 8.66706L18.0235 10.4645V10.4645"
        stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
          </button>
        </div>
        <div className="text-gray-700 bg-gray-50 p-4 rounded shadow-sm min-h-[70px]">
          {editBio ? (
        <>
          <textarea
        value={bio ?? ''}
        onChange={(e) => setBio(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
         rows={4}
        placeholder="Write your bio here..."
          />
           <div className="flex gap-4 mt-2">
          <button
        onClick={() => {
          handleUpdate('bio', bio);
          setEditBio(false);
        }}
        className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
          >
        Save
          </button>
          <button
        onClick={() => {
          setEditBio(false);
        }}
        className="text-sm text-gray-500 hover:underline"
          >
        Cancel
          </button>
        </div>
          </>
        ) : (
          <p className="text-center text-sm">{bio || 'No bio yet.'}</p>
        )}
      </div>
        </section>

          {/* Artist Product Form */}
          {role === 'artist' && (
        <section className="bg-white p-6 mt-10 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-black">Artist Panel</h2>
        <button
          onClick={() => setShowProductForm(!showProductForm)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showProductForm ? 'Close Form' : 'Submit a Product'}
        </button>
          </div>

          {showProductForm && (
        <form
          onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
        const price = parseFloat(
          (form.elements.namedItem('price') as HTMLInputElement).value
        );
        const description = (
          form.elements.namedItem('description') as HTMLTextAreaElement
        ).value;
        const image = (form.elements.namedItem('image') as HTMLInputElement).files?.[0];

        if (!image || !title || isNaN(price)) {
          alert('Please fill all fields and upload an image.');
          return;
        }

        const ext = image.name.split('.').pop() || 'jpg';
        const filePath = `${user.id}-${uuidv4()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);
        if (uploadError) {
          console.error('Upload error:', uploadError.message);
          alert('Image upload failed.');
          return;
        }

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (!publicData?.publicUrl) {
          console.error('Failed to get public URL.');
          alert('Failed to get image URL.');
          return;
        }

        const publicUrl = publicData.publicUrl;

        const { error: insertError } = await supabase.from('products').insert({
          title,
          price,
          description,
          image_url: publicUrl,
          artist_id: user.id
        });

        if (insertError) {
          console.error('Insert error:', insertError.message);
          alert('Product submission failed.');
        } else {
          alert('Product submitted!');
          form.reset();
          form.reset();
          (form.elements.namedItem('image') as HTMLInputElement).value = '';
          setShowProductForm(false);
        }
          }}
          className="space-y-4 mt-4"
        >
          <input name="title" placeholder="Product Title" className="text-gray-500 w-full border p-2 rounded" />
          <input name="price" type="number" placeholder="Price (₱)" className="text-gray-500 w-full border p-2 rounded" />
          <textarea name="description" placeholder="Product Description" className="text-gray-500 w-full border p-2 rounded" />
          <input name="image" type="file" accept="image/*" className="text-gray-500 w-full border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Product
          </button>
        </form>
          )}
          {/* My Products */}
        {role === 'artist' && myProducts.length > 0 && (
          <section className="mt-10">
        <h2 className="text-lg font-semibold text-black mb-2">My Product Listings</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {myProducts.map((product) => (
        <a
          key={product.id}
          href={`/products/${product.id}`}
          className="block text-gray-500 border rounded p-4 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition relative"
        >
          <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
            <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover"
            />
          </div>
          <h3 className="font-bold text-lg">{product.title}</h3>
          <p className="text-blue-600 font-semibold">₱{product.price.toFixed(2)}</p>
          {/* Edit Button */}
            <button
            type="button"
            className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-blue-100"
            title="Edit Product"
            onClick={e => {
              e.preventDefault();
              window.location.href = `http://localhost:3000/products/${product.id}/edit`;
            }}
            >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 21H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M18.0235 10.4646L7.58554 20.9026H2.76801L2.76489 16.0819L13.2029 5.64392L18.0235 10.4646Z"
              stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.2029 5.64388L15.0004 3.84641C15.7814 3.06536 17.0477 3.06536 17.8288 3.84641L19.821 5.83863C20.6021 6.61968 20.6021 7.88601 19.821 8.66706L18.0235 10.4645V10.4645"
              stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </button>
          {/* Placeholder for future "Edit" functionality */}
        </a>
          ))}
        </div>
          </section>
        )}
        </section>
          )}
        </div>
      </div>
      {/* Avatar Uploader */}
      {showAvatarUploader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">Upload New Avatar</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-100 file:text-blue-700
                hover:file:bg-blue-200"
            />

            {avatarFile && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <Image
                  src={URL.createObjectURL(avatarFile)}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border mx-auto"
                  unoptimized
                />
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={async () => {
                  await handleAvatarUpload();
                  setUploadSuccess(true); // Show message
                  setTimeout(() => {
                    setShowAvatarUploader(false);
                    setAvatarFile(null);
                    setUploadSuccess(false); // Reset message
                  }, 1500); // 1.5 seconds delay
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload
              </button>
              {uploadSuccess && (
                <p className="text-green-600 text-center mt-2">Avatar uploaded!</p>
              )}

              <button
                onClick={() => {
                  setShowAvatarUploader(false);
                  setAvatarFile(null);
                }}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

