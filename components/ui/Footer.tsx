import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white/80 py-12 mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">MODENA</h3>
            <p className="text-sm">Digital fashion brand untuk gaya masa kini.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products?category=streetwear">Streetwear</Link></li>
              <li><Link href="/products?category=korean-style">Korean Style</Link></li>
              <li><Link href="/products?category=old-money">Old Money</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inspiration">Outfit Inspiration</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YT</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
            </div>
            <p className="text-xs mt-4">© 2025 MODENA.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}