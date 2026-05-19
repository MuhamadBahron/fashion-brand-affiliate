'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewInspirationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/inspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()),
        })
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Article created!')
        router.push('/admin/inspirations')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to create article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/inspirations" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Outfit Inspiration</h1>
          <p className="text-gray-500">Create a new style guide article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            <p className="text-xs text-gray-400 mt-1">URL-friendly (e.g., korean-style-outfit)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL *</label>
          <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt *</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border rounded-lg" />
          <p className="text-xs text-gray-400 mt-1">Short description (appears in cards)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required rows={10} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
          <p className="text-xs text-gray-400 mt-1">HTML content supported</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="korean style, streetwear, outfit ideas" className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/admin/inspirations" className="px-4 py-2 border rounded-lg">Cancel</Link>
          <button type="submit" disabled={loading} className="bg-dark text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} />
            {loading ? 'Saving...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  )
}