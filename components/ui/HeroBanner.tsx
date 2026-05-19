'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: "New Drop: Old Money Edit",
      subtitle: "Elevate your style with timeless elegance",
      cta: "Shop Now",
      link: "/products?category=old-money",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920",
      bgColor: "from-beige to-white"
    },
    {
      title: "Viral TikTok Streetwear",
      subtitle: "Oversized tee & cargo pants yang lagi hits",
      cta: "Shop Now",
      link: "/products?category=streetwear",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920",
      bgColor: "from-dark to-charcoal"
    },
    {
      title: "Korean Style Aesthetic",
      subtitle: "Look effortless with Korean fashion",
      cta: "Shop Now",
      link: "/products?category=korean-style",
      image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1920",
      bgColor: "from-softgray to-beige"
    }
  ]
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])
  
  return (
    <div className="relative h-screen max-h-[600px] md:max-h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ${
            currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-70`} />
          </div>
          
          {/* Content */}
          <div className="relative h-full flex items-center container-custom">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                {slide.subtitle}
              </p>
              <Link 
                href={slide.link}
                className="inline-flex items-center gap-2 bg-white text-dark px-8 py-3 rounded-full font-semibold hover:scale-105 transition duration-300"
              >
                {slide.cta}
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Arrow Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition"
      >
        <ChevronRight className="rotate-180" size={24} />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}