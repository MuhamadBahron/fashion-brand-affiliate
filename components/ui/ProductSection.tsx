'use client'

import Link from 'next/link'
import ProductCard from './ProductCard'
import { ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  modelImageUrl?: string | null  // ← Ubah
  isTrending?: boolean
  isViral?: boolean
  shopeeLink: string
  category?: {
    name: string
    slug: string
  }
}

interface ProductSectionProps {
  title: string
  products: Product[]  // ← Sekarang cocok
  viewAllLink?: string
  bgColor?: string
}

export default function ProductSection({ 
  title, 
  products, 
  viewAllLink, 
  bgColor = 'bg-white' 
}: ProductSectionProps) {
  if (!products || products.length === 0) {
    return null
  }
  
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="flex items-center gap-1 text-dark hover:text-gray-600 transition group"
            >
              <span>View All</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}