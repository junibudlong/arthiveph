'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useUser from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  interface User {
    id: string
    username: string
    email: string
    role: string
  }
  interface Product {
    id: string
    title: string
    price: number
    image_url: string
    status: string
    artist_id: string
  }
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [statusProductFilter, setStatusProductFilter] = useState('all')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [productSearch, setProductSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.replace('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('id, username, email, role')
      if (data) setUsers(data)
      setLoadingUsers(false)
    }

    if (user?.role === 'admin') {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, title, price, image_url, status, artist_id')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* 🔍 Search */}
            <div>
              <label className="mr-2 text-sm font-medium">Search Users:</label>
              <input
              type="text"
              placeholder="Search by username or email"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value.toLowerCase())}
              className="border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* 🎯 Role Filter */}
            <div>
              <label className="mr-2 text-sm font-medium">Filter by Role:</label>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option className="text-black" value="all">All</option>
                <option className="text-black" value="user">User</option>
                <option className="text-black" value="artist">Artist</option>
                <option className="text-black" value="admin">Admin</option>
              </select>
            </div>
          </div>
      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-blackp-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) =>
                (userRoleFilter === 'all' || u.role === userRoleFilter) &&
                (u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email?.toLowerCase().includes(userSearch.toLowerCase()))
              )
              .map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">@{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2 space-x-2">
                  {u.role !== 'admin' && (
                    <button
                      onClick={async () => {
                        await supabase.from('profiles').update({ role: 'admin' }).eq('id', u.id)
                        setUsers((prev) =>
                          prev.map((usr) =>
                            usr.id === u.id ? { ...usr, role: 'admin' } : usr
                          )
                        )
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Promote to Admin
                    </button>
                  )}
                  {u.role !== 'artist' && (
                    <button
                      onClick={async () => {
                        await supabase.from('profiles').update({ role: 'artist' }).eq('id', u.id)
                        setUsers((prev) =>
                          prev.map((usr) =>
                            usr.id === u.id ? { ...usr, role: 'artist' } : usr
                          )
                        )
                      }}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Promote to Artist
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <section className="mt-10">
        <div className="mb-4">
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div>
                <label className="mr-2 text-sm font-medium">Search Products:</label>
                <input
                  type="text"
                  placeholder="Search by title"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="mr-2 text-sm font-medium">Filter by Status:</label>
                <select
                  value={statusProductFilter}
                  onChange={(e) => setStatusProductFilter(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option className="text-black" value="all">All</option>
                  <option className="text-black" value="approved">Approved</option>
                  <option className="text-black" value="pending">Pending</option>
                  <option className="text-black" value="rejected">Rejected</option>
                </select>
              </div>
            </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Product Submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) =>
                  (statusProductFilter === 'all' || p.status === statusProductFilter) &&
                  p.title.toLowerCase().includes(productSearch.toLowerCase())
                )
                .map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">₱{p.price.toFixed(2)}</td>
                  <td className="p-2 capitalize">{p.status}</td>
                  <td className="p-2 space-x-2">
                    {p.status !== 'approved' && (
                      <button
                        onClick={async () => {
                          await supabase.from('products').update({ status: 'approved' }).eq('id', p.id)
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, status: 'approved' } : prod
                            )
                          )
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Approve
                      </button>
                    )}
                    {p.status !== 'rejected' && (
                      <button
                        onClick={async () => {
                          await supabase.from('products').update({ status: 'rejected' }).eq('id', p.id)
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, status: 'rejected' } : prod
                            )
                          )
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    )}
                    <a
                      href={`/products/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline"
                    >
                      View
                    </a>
                    <button
                      onClick={async () => {
                        const confirmed = confirm(`Are you sure you want to delete "${p.title}"?`)
                        if (!confirmed) return
                        const { error } = await supabase.from('products').delete().eq('id', p.id)
                        if (!error) {
                          setProducts((prev) => prev.filter((prod) => prod.id !== p.id))
                        } else {
                          alert('Failed to delete product.')
                        }
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
