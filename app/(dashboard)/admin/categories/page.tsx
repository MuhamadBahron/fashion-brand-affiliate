'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  imageUrl: string | null
  _count?: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    imageUrl: '',
  })
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.categories)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id)
    const productCount = category?._count?.products || 0
    
    // Konfirmasi dengan peringatan jumlah produk yang akan terhapus
    const confirmMessage = productCount > 0
      ? `Kategori "${category?.name}" memiliki ${productCount} produk. Menghapus kategori akan menghapus SEMUA produk di dalamnya. Yakin?`
      : `Hapus kategori "${category?.name}"?`
    
    if (!confirm(confirmMessage)) return
    
    setDeletingId(id)
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        toast.success(productCount > 0 
          ? `Kategori dan ${productCount} produk berhasil dihapus` 
          : 'Kategori berhasil dihapus'
        )
        fetchCategories()
      } else {
        toast.error(result.error || 'Failed to delete category')
      }
    } catch (error) {
      toast.error('Failed to delete category')
    } finally {
      setDeletingId(null)
      setShowDeleteConfirm(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingCategory 
      ? `/api/categories/${editingCategory.id}` 
      : '/api/categories'
    
    try {
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      if (result.success) {
        toast.success(editingCategory ? 'Category updated' : 'Category created')
        setShowModal(false)
        setEditingCategory(null)
        setFormData({ name: '', slug: '', icon: '', imageUrl: '' })
        setImagePreview('')
        fetchCategories()
      } else {
        toast.error(result.error || 'Failed to save category')
      }
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      imageUrl: category.imageUrl || '',
    })
    setImagePreview(category.imageUrl || '')
    setShowModal(true)
  }

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
    setImagePreview(url)
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage product categories</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', slug: '', icon: '', imageUrl: '' })
            setImagePreview('')
            setShowModal(true)
          }}
          className="bg-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-charcoal transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
            {category.imageUrl && (
              <div className="h-32 overflow-hidden bg-gray-100">
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon || '📁'}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">slug: {category.slug}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {category._count?.products || 0} products
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(category)}
                    className="p-1 hover:bg-gray-100 rounded transition"
                  >
                    <Pencil size={16} className="text-green-500" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-50"
                  >
                    {deletingId === category.id ? (
                      <Loader2 size={16} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={16} className="text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Accessories"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    placeholder="e.g., accessories"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    placeholder="👕"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="bg-dark text-white px-4 py-2 rounded-lg">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
