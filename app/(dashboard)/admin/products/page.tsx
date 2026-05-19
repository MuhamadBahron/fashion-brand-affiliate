'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Eye, Plus, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  category: { name: string }
  views: number
  clicks: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) setProducts(data.products)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      toast.success('Product deleted')
      fetchProducts()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={40} /></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new" className="bg-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-4 text-left">Product</th><th className="p-4 text-left">Price</th><th className="p-4 text-left">Category</th><th className="p-4 text-left">Views</th><th className="p-4 text-left">Clicks</th><th className="p-4 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">Rp{p.price.toLocaleString('id-ID')}</td>
                <td className="p-4">{p.category?.name || '-'}</td>
                <td className="p-4">{p.views}</td>
                <td className="p-4">{p.clicks}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}`}><Eye size={16} className="text-blue-500" /></Link>
                    <Link href={`/admin/products/${p.id}/edit`}><Pencil size={16} className="text-green-500" /></Link>
                    <button onClick={() => handleDelete(p.id)}><Trash2 size={16} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
