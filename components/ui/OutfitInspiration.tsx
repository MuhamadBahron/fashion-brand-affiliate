'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Inspiration {
  id: string
  title: string
  slug: string
  imageUrl: string
  excerpt: string
}

export default function OutfitInspiration() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inspirations')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.inspirations)) {
          setInspirations(data.inspirations)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-beige">
        <div className="container-custom text-center">
          <Loader2 className="animate-spin mx-auto text-dark" size={32} />
        </div>
      </section>
    )
  }

  if (inspirations.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-beige">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Outfit Inspiration</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dapatkan ide gaya dari lookbook kami. Temukan kombinasi outfit terbaik untuk berbagai acara.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirations.map((inspiration) => (
            <Link
              key={inspiration.id}
              href={`/inspiration/${inspiration.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={inspiration.imageUrl}
                  alt={inspiration.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 group-hover:text-gray-600 transition line-clamp-2">
                  {inspiration.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {inspiration.excerpt}
                </p>
                <div className="flex items-center gap-2 text-dark font-medium group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/inspiration" className="inline-flex items-center gap-2 btn-outline">
            View All Inspirations
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}