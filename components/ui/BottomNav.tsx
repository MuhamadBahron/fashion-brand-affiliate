'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Heart, label: 'Saved', href: '/saved' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                isActive ? 'text-dark' : 'text-gray-400'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}