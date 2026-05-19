'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ui/ProductCard'
import FilterSidebar from '@/components/ui/FilterSidebar'
import { Filter, Grid3X3, LayoutList, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  modelImageUrl: string | null
  isTrending: boolean
  isViral: boolean
  shopeeLink: string
  category: { name: string; slug: string }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const trendingFilter = searchParams.get('filter')
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [categoryFilter, trendingFilter, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      if (result.success) {
        setProducts(result.products)
        setFilteredProducts(result.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]
    
    if (categoryFilter) {
      filtered = filtered.filter(p => 
        p.category.slug.toLowerCase() === categoryFilter.toLowerCase()
      )
    }
    
    if (trendingFilter === 'trending') {
      filtered = filtered.filter(p => p.isTrending)
    } else if (trendingFilter === 'viral') {
      filtered = filtered.filter(p => p.isViral)
    }
    
    setFilteredProducts(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-dark" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-beige py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} />
            Filter
          </button>
          
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-dark text-white' : 'border'}`}>
              <Grid3X3 size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-dark text-white' : 'border'}`}>
              <LayoutList size={18} />
            </button>
          </div>
        </div>
        
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
          : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} modelImageUrl={product.modelImageUrl || undefined} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
      
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}
