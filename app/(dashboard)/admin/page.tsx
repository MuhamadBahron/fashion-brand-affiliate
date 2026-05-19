'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, MousePointerClick, DollarSign, TrendingUp, Package, Tag, Image as ImageIcon, BarChart3, Loader2 } from 'lucide-react'

interface Stats {
  totalVisitors: number
  totalClicks: number
  estimatedCommission: number
  conversionRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    totalClicks: 0,
    estimatedCommission: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/stats')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-dark" size={40} />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Total Visitors</p>
          <p className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MousePointerClick className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Affiliate Clicks</p>
          <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Conversion Rate</p>
          <p className="text-2xl font-bold">{stats.conversionRate}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Est. Commission</p>
          <p className="text-2xl font-bold">Rp{stats.estimatedCommission.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products" className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-center group">
            <Package className="mx-auto text-gray-600 group-hover:text-dark mb-2" size={28} />
            <p className="font-medium">Products</p>
          </Link>
          <Link href="/admin/categories" className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-center group">
            <Tag className="mx-auto text-gray-600 group-hover:text-dark mb-2" size={28} />
            <p className="font-medium">Categories</p>
          </Link>
          <Link href="/admin/banners" className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-center group">
            <ImageIcon className="mx-auto text-gray-600 group-hover:text-dark mb-2" size={28} />
            <p className="font-medium">Banners</p>
          </Link>
          <Link href="/admin/analytics" className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-center group">
            <BarChart3 className="mx-auto text-gray-600 group-hover:text-dark mb-2" size={28} />
            <p className="font-medium">Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
