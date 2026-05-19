'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    imageUrl: '',
    modelImageUrl: '',
    shopeeLink: '',
    categoryId: '',
    isTrending: false,
    isViral: false,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const result = await response.json()
        if (result.success) {
          setCategories(result.categories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      const { id } = await params
      try {
        const response = await fetch(`/api/products/${id}`)
        const result = await response.json()
        if (result.success) {
          const p = result.product
          setFormData({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price.toString(),
            imageUrl: p.imageUrl,
            modelImageUrl: p.modelImageUrl || '',
            shopeeLink: p.shopeeLink,
            categoryId: p.categoryId,
            isTrending: p.isTrending,
            isViral: p.isViral,
          })
        } else {
          toast.error('Product not found')
          router.push('/admin/products')
        }
      } catch (error) {
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const { id } = await params
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
        })
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Product updated successfully')
        router.push('/admin/products')
      } else {
        toast.error(result.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Error updating product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-dark" size={40} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-gray-500">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (IDR) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL *</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model Image URL</label>
              <input type="url" name="modelImageUrl" value={formData.modelImageUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shopee Link *</label>
              <input type="url" name="shopeeLink" value={formData.shopeeLink} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} />
                <span>Trending</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isViral" checked={formData.isViral} onChange={handleChange} />
                <span>Viral on TikTok</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Link href="/admin/products" className="px-4 py-2 border rounded-lg">Cancel</Link>
          <button type="submit" disabled={saving} className="bg-dark text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}