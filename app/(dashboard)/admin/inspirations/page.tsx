'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Inspiration {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  views: number
  createdAt: string
}

export default function InspirationsPage() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchInspirations()
  }, [])

  const fetchInspirations = async () => {
    try {
      const response = await fetch('/api/inspirations')
      const result = await response.json()
      if (result.success) {
        setInspirations(result.inspirations)
      }
    } catch (error) {
      toast.error('Failed to load inspirations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inspiration?')) return
    
    setDeletingId(id)
    try {
      const response = await fetch(`/api/inspirations/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        toast.success('Inspiration deleted')
        fetchInspirations()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Outfit Inspiration</h1>
          <p className="text-gray-500">Manage blog articles & style guides</p>
        </div>
        <Link href="/admin/inspirations/new" className="bg-dark text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          Add Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Views</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspirations.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-gray-500">{item.slug}</td>
                <td className="p-4">{item.views}</td>
                <td className="p-4 text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/inspiration/${item.slug}`} className="p-1 hover:bg-gray-100 rounded">
                      <Eye size={16} className="text-blue-500" />
                    </Link>
                    <Link href={`/admin/inspirations/${item.id}/edit`} className="p-1 hover:bg-gray-100 rounded">
                      <Pencil size={16} className="text-green-500" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="p-1 hover:bg-gray-100 rounded">
                      {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} className="text-red-500" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inspirations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles yet. Click "Add Article" to create your first outfit inspiration.
          </div>
        )}
      </div>
    </div>
  )
}