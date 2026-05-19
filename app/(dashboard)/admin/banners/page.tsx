'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, Loader2, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  buttonText: string
  buttonLink: string
  isActive: boolean
  order: number
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      const result = await response.json()
      if (result.success) {
        setBanners(result.banners)
      }
    } catch (error) {
      toast.error('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' })
      toast.success('Banner deleted')
      fetchBanners()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners'
    
    try {
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      if (result.success) {
        toast.success(editingBanner ? 'Banner updated' : 'Banner created')
        setShowModal(false)
        setEditingBanner(null)
        setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: 'Shop Now', buttonLink: '/products', isActive: true, order: 0 })
        fetchBanners()
      }
    } catch (error) {
      toast.error('Failed to save')
    }
  }

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      isActive: banner.isActive,
      order: banner.order,
    })
    setShowModal(true)
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-gray-500">Manage homepage hero banners</p>
        </div>
        <button 
          onClick={() => {
            setEditingBanner(null)
            setFormData({ title: '', subtitle: '', imageUrl: '', buttonText: 'Shop Now', buttonLink: '/products', isActive: true, order: banners.length })
            setShowModal(true)
          }}
          className="bg-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-32 bg-gray-100">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{banner.title}</h3>
                    {banner.subtitle && <p className="text-gray-500 text-sm">{banner.subtitle}</p>}
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-400">Link: {banner.buttonLink}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-400">Order: {banner.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(banner)} className="p-1 hover:bg-gray-100 rounded">
                      <Pencil size={16} className="text-green-500" />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">No banners yet. Click "Add Banner" to create one.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input type="text" value={formData.buttonLink} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  <span>Active</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-20 px-2 py-1 border rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="bg-dark text-white px-4 py-2 rounded-lg">{editingBanner ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}