'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-slide banner
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const fetchData = async () => {
    try {
      const [catRes, prodRes, bannerRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/banners')
      ])
      const catData = await catRes.json()
      const prodData = await prodRes.json()
      const bannerData = await bannerRes.json()
      
      if (catData.success) setCategories(catData.categories.slice(0, 4))
      if (prodData.success) {
        const allProducts = prodData.products
        setFeaturedProducts(allProducts.filter((p: Product) => p.isTrending).slice(0, 8))
        setNewArrivals(allProducts.slice(0, 8))
      }
      if (bannerData.success) {
        const activeBanners = bannerData.banners.filter((b: Banner) => b.isActive)
        setBanners(activeBanners)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Default images for categories if imageUrl is empty
  const defaultImages: Record<string, string> = {
    'Streetwear': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'Korean Style': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400',
    'Old Money': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    'Viral TikTok': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
  }

  // Gunakan banner pertama sebagai default jika tidak ada banner di database
  const activeBanner = banners[currentBanner] || {
    title: 'Timeless Elegance',
    subtitle: 'Summer Collection 2024',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920',
    buttonText: 'Explore Collection',
    buttonLink: '/products'
  }

  return (
    <main className="pb-20">
      {/* Hero Section - Dynamic Banner dari Database */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={activeBanner.imageUrl}
            alt={activeBanner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 container-custom">
          <div className="max-w-xl text-white">
            <span className="text-sm uppercase tracking-[0.2em] font-light">
              {activeBanner.subtitle || 'New Collection'}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mt-6 mb-6 leading-tight">
              {activeBanner.title}
            </h1>
            <p className="text-white/80 mb-8 text-lg font-light leading-relaxed">
              Discover curated pieces that blend classic sophistication with contemporary design.
            </p>
            <Link 
              href={activeBanner.buttonLink} 
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition"
            >
              {activeBanner.buttonText} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Banner Indicators (dots) */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentBanner === index ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide">Shop by Category</h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mt-4 mb-4" />
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Explore our carefully curated collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const imageUrl = cat.imageUrl || defaultImages[cat.name] || 'https://placehold.co/400x500?text=' + cat.name
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100"
                >
                  <img 
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-lg font-medium tracking-wide mb-2">{cat.name}</span>
                    <span className="text-xs opacity-80 group-hover:opacity-100 transition">Shop Now →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide">Editor's Picks</h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mt-4 mb-4" />
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Our favorite pieces, curated just for you
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide">New Arrivals</h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mt-4 mb-4" />
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Fresh styles added weekly
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="container-custom text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-5 opacity-60" />
          <h2 className="text-2xl md:text-3xl font-light mb-3">Join the Inner Circle</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Subscribe to receive updates on new arrivals and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-full bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
            />
            <button className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}