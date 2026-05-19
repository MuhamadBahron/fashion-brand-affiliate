'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ui/ProductCard'
import { Filter, X, Grid3X3, LayoutList, ChevronDown, Loader2 } from 'lucide-react'

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

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [selectedCategory, sortBy, priceRange, products])

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ])
      const prodData = await prodRes.json()
      const catData = await catRes.json()
      
      if (prodData.success) setProducts(prodData.products)
      if (catData.success) setCategories(catData.categories)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.slug === selectedCategory)
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
    }
    
    setFilteredProducts(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-800" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">All Products</h1>
          <p className="text-gray-500 text-sm">{filteredProducts.length} items</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <Filter size={16} /> Filter
            </button>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory('')}
                className="flex items-center gap-1 text-xs bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
              >
                {categories.find(c => c.slug === selectedCategory)?.name} <X size={12} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-black' : 'text-gray-400'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded ${viewMode === 'list' ? 'text-black' : 'text-gray-400'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
            
            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent text-sm text-gray-600 pr-6 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
          : 'space-y-5'
        }>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Mobile Filter Sidebar */}
      {showFilter && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="font-medium">Filter</h3>
              <button onClick={() => setShowFilter(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-sm">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm">
                    <input 
                      type="radio" 
                      name="category" 
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4"
                    />
                    <span>All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 text-sm">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-sm">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rp0</span>
                    <span>Rp{priceRange[1].toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilter(false)}
              className="w-full mt-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
