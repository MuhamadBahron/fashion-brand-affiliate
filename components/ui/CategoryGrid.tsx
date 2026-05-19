'use client'

import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null  // ← Ubah: tambahkan | null
}

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const categoryImages: Record<string, string> = {
    'Streetwear': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'Korean Style': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400',
    'Old Money': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    'Viral TikTok': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400'
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-xl aspect-square"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${categoryImages[category.name]})` }}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />
          <div className="relative h-full flex flex-col items-center justify-center text-white">
            <span className="text-4xl mb-2">{category.icon || '📁'}</span>
            <h3 className="text-lg font-semibold text-center">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}