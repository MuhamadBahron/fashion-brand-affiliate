'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [shopeeUrl, setShopeeUrl] = useState('')
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

  // Fetch categories on mount - PERBAIKAN: pakai useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const result = await response.json()
        if (result.success) {
          setCategories(result.categories)
          if (result.categories.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: result.categories[0].id }))
          }
        }
      } catch (error) {
        toast.error('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFetchProductData = async () => {
    if (!shopeeUrl) {
      toast.error('Masukkan link Shopee terlebih dahulu')
      return
    }

    if (!shopeeUrl.includes('shopee.co.id')) {
      toast.error('Harap masukkan link produk Shopee yang valid')
      return
    }

    setIsFetching(true)
    toast.loading('Mengambil data produk...', { id: 'scrape' })

    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: shopeeUrl }),
      })

      const result = await response.json()

      if (result.success) {
        const { name, price, imageUrl, description } = result.data
        
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        
        setFormData(prev => ({
          ...prev,
          name: name,
          slug: slug,
          price: price.toString(),
          imageUrl: imageUrl,
          description: description || prev.description,
          shopeeLink: shopeeUrl,
        }))
        
        toast.success('Data produk berhasil diambil!', { id: 'scrape' })
      } else {
        toast.error(result.error || 'Gagal mengambil data produk', { id: 'scrape' })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Terjadi kesalahan saat mengambil data', { id: 'scrape' })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!formData.shopeeLink.includes('shopee.co.id')) {
      toast.error('Please enter a valid Shopee affiliate link')
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
        })
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Product added successfully!')
        router.push('/admin/products')
      } else {
        toast.error(result.error || 'Failed to add product')
      }
    } catch (error) {
      toast.error('Error adding product')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-dark" size={40} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Paste link Shopee, klik "Auto-Fill" untuk isi otomatis</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Sparkles className="text-purple-500 flex-shrink-0" size={20} />
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">✨ Fitur Auto-Fill Produk</p>
          <p>1. Copy link produk dari Shopee (bisa link biasa atau affiliate)</p>
          <p>2. Paste di bawah, lalu klik <strong>"Auto-Fill"</strong></p>
          <p>3. Nama, harga, gambar akan terisi otomatis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Shopee Link dengan tombol Fetch */}
            <div>
              <label className="block text-sm font-medium mb-1">Link Produk Shopee *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={shopeeUrl}
                  onChange={(e) => setShopeeUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-dark"
                  placeholder="https://shopee.co.id/...?affiliate_id=xxxxx"
                />
                <button
                  type="button"
                  onClick={handleFetchProductData}
                  disabled={isFetching}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {isFetching ? 'Mengambil...' : 'Auto-Fill'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Masukkan link produk Shopee, klik "Auto-Fill" untuk mengisi otomatis
              </p>
            </div>

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
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model Image URL</label>
              <input type="url" name="modelImageUrl" value={formData.modelImageUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shopee Affiliate Link *</label>
              <input 
                type="url" 
                name="shopeeLink" 
                value={formData.shopeeLink} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
          <button type="submit" disabled={isLoading} className="bg-dark text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
