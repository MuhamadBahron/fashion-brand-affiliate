'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  MousePointerClick, 
  Package, 
  Users, 
  DollarSign,
  Eye,
  ShoppingBag
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  
  const stats = {
    totalClicks: 12458,
    totalProducts: 1248,
    totalVisitors: 25687,
    estimatedCommission: 8750000,
    clicksGrowth: 18.2,
    productsGrowth: 12.5,
    visitorsGrowth: 22.1,
    commissionGrowth: 15.3,
  }
  
  const dailyData = [
    { date: '1 Mei', clicks: 320, visitors: 890 },
    { date: '7 Mei', clicks: 450, visitors: 1200 },
    { date: '13 Mei', clicks: 580, visitors: 1500 },
    { date: '19 Mei', clicks: 720, visitors: 1850 },
    { date: '25 Mei', clicks: 890, visitors: 2100 },
    { date: '31 Mei', clicks: 1050, visitors: 2500 },
  ]

  const categorySales = [
    { name: 'Streetwear', value: 35, color: '#1a1a1a' },
    { name: 'Korean Style', value: 28, color: '#4a4a4a' },
    { name: 'Old Money', value: 22, color: '#7a7a7a' },
    { name: 'Accessories', value: 15, color: '#aaaaaa' },
  ]

  const topProducts = [
    { name: 'Oversized Graphic Tee', sales: 1234, revenue: 233000000 },
    { name: 'Cargo Pants Black', sales: 987, revenue: 345000000 },
    { name: 'Wool Blazer Beige', sales: 654, revenue: 365000000 },
    { name: 'Knitted Cardigan', sales: 543, revenue: 151000000 },
    { name: 'Leather Jacket', sales: 432, revenue: 388000000 },
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan performa toko affiliate Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Klik */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={14} />
              <span className="font-medium">{stats.clicksGrowth}%</span>
              <span className="text-gray-400 text-xs">vs bulan lalu</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold">{stats.totalClicks.toLocaleString('id-ID')}</p>
          <p className="text-gray-500 text-sm mt-1">Total Klik</p>
        </div>

        {/* Total Produk */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={14} />
              <span className="font-medium">{stats.productsGrowth}%</span>
              <span className="text-gray-400 text-xs">vs bulan lalu</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold">{stats.totalProducts.toLocaleString('id-ID')}</p>
          <p className="text-gray-500 text-sm mt-1">Total Produk</p>
        </div>

        {/* Total Pengunjung */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={14} />
              <span className="font-medium">{stats.visitorsGrowth}%</span>
              <span className="text-gray-400 text-xs">vs bulan lalu</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold">{stats.totalVisitors.toLocaleString('id-ID')}</p>
          <p className="text-gray-500 text-sm mt-1">Total Pengunjung</p>
        </div>

        {/* Komisi */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp size={14} />
              <span className="font-medium">{stats.commissionGrowth}%</span>
              <span className="text-gray-400 text-xs">vs bulan lalu</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold">{formatCurrency(stats.estimatedCommission)}</p>
          <p className="text-gray-500 text-sm mt-1">Komisi (Estimasi)</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-4">Grafik Klik & Pengunjung</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="clicks" stroke="#1a1a1a" strokeWidth={2} dot={{ fill: '#1a1a1a', r: 3 }} name="Klik" />
              <Line type="monotone" dataKey="visitors" stroke="#9ca3af" strokeWidth={2} dot={{ fill: '#9ca3af', r: 3 }} name="Pengunjung" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-4">Kategori Terlaris</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categorySales}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-800">Top Produk Terlaris</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Produk</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Total Penjualan</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{product.sales.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium text-gray-800">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-800">Aktivitas Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={14} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Produk baru ditambahkan</p>
                <p className="text-xs text-gray-400">2 jam yang lalu</p>
              </div>
              <Eye size={14} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}