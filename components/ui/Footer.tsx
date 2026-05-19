import Link from 'next/link'
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white/80 py-12 mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">MODENA</h3>
            <p className="text-sm">
              Digital fashion brand untuk gaya masa kini. Temukan outfit viral dan aesthetic terbaru.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/products?category=streetwear" className="hover:text-white transition">Streetwear</Link></li>
              <li><Link href="/products?category=korean-style" className="hover:text-white transition">Korean Style</Link></li>
              <li><Link href="/products?category=old-money" className="hover:text-white transition">Old Money</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inspiration" className="hover:text-white transition">Outfit Inspiration</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Youtube size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Facebook size={20} />
              </a>
            </div>
            <p className="text-xs mt-4">© 2025 MODENA. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
