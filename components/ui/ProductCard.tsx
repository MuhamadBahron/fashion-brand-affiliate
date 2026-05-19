'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Flame, TrendingUp, Eye, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
  modelImageUrl?: string | null
  isTrending?: boolean
  isViral?: boolean
  shopeeLink: string
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  modelImageUrl,
  isTrending = false,
  isViral = false,
  shopeeLink
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Format harga dengan benar untuk SEMUA range
  const formatPrice = (price: number) => {
    // Jika harga 0 atau null, tampilkan placeholder
    if (!price || price === 0) {
      return 'Rp—'
    }
    
    let actualPrice = price
    
    // LOGIKA: Harga dari database bisa dalam format:
    // - 2 (berarti 2.000) -> kalikan 1000
    // - 109 (berarti 109.000) -> kalikan 1000
    // - 259 (berarti 259.000) -> kalikan 1000
    // - 2384 (berarti 2.384.000) -> kalikan 1000
    // - 1500000 (berarti 1.500.000) -> sudah benar, jangan dikalikan
    
    // Cek apakah harga kemungkinan besar sudah dalam Rupiah penuh
    // Harga Rupiah penuh biasanya > 10000 (10 ribu)
    // Harga dalam ribuan biasanya < 10000 (10 ribu) tapi > 0
    if (price < 10000 && price > 0) {
      // Harga masih dalam bentuk ribuan, kalikan 1000
      actualPrice = price * 1000
    }
    // Jika price >= 10000, asumsikan sudah dalam Rupiah penuh
    
    // Pastikan hasilnya integer
    actualPrice = Math.round(actualPrice)
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(actualPrice)
  }
  
  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      })
      
      window.open(shopeeLink, '_blank')
      toast.success('Redirecting to Shopee...')
    } catch (error) {
      console.error('Failed to track click:', error)
      window.open(shopeeLink, '_blank')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Gunakan modelImageUrl jika ada dan sedang hover
  const displayImage = isHovered && modelImageUrl ? modelImageUrl : imageUrl
  
  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-softgray">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isTrending && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Flame size={12} />
              Trending
            </span>
          )}
          {isViral && (
            <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} />
              Viral
            </span>
          )}
        </div>
        
        {/* Quick View Button */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-white text-dark px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            {isLoading ? 'Redirecting...' : 'Beli di Shopee'}
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="text-dark font-bold text-xl">{formatPrice(price)}</p>
      </div>
    </div>
  )
}