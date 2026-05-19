'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-5'
    }`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-heading tracking-tight">
          MODENA
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8">
          <Link href="/products" className="hover:text-gray-600 transition">Shop</Link>
          <Link href="/inspiration" className="hover:text-gray-600 transition">Inspiration</Link>
          <Link href="/products?category=streetwear" className="hover:text-gray-600 transition">Streetwear</Link>
          <Link href="/products?category=korean-style" className="hover:text-gray-600 transition">Korean</Link>
          <Link href="/products?category=old-money" className="hover:text-gray-600 transition">Old Money</Link>
        </nav>
        
        {/* Desktop Icons */}
        <div className="hidden md:flex gap-5">
          <Link href="/search" className="hover:text-gray-600 transition">
            <Search size={20} />
          </Link>
          <button className="hover:text-gray-600 transition relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-dark text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-5 px-6 border-t">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg hover:text-gray-600 transition"
            >
              Shop All
            </Link>
            <Link 
              href="/inspiration" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg hover:text-gray-600 transition"
            >
              Inspiration
            </Link>
            <Link 
              href="/search" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg hover:text-gray-600 transition"
            >
              Search
            </Link>
            <hr className="my-2" />
            <Link 
              href="/products?category=streetwear" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Streetwear
            </Link>
            <Link 
              href="/products?category=korean-style" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Korean Style
            </Link>
            <Link 
              href="/products?category=old-money" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Old Money
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}