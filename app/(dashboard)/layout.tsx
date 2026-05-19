'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Image as ImageIcon, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: ImageIcon, label: 'Banners', href: '/admin/banners' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        if (!data.authenticated) {
          router.push('/admin-login')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        router.push('/admin-login')
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/admin-login')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-black text-white transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-0 md:w-20'
      } overflow-hidden`}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-xl ${!isSidebarOpen && 'md:hidden'}`}>
              MODENA
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <Menu size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          
          <div className="absolute bottom-5 left-0 right-0 px-5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition w-full"
            >
              <LogOut size={20} />
              <span className={`${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      }`}>
        <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-xl">MODENA Admin</h1>
          <div className="w-6" />
        </div>
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
      
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
