'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Eye, MousePointerClick, DollarSign, TrendingUp, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'

const COLORS = ['#0A0A0A', '#8B5CF6', '#EC4899', '#3B82F6', '#6B7280']

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalClicks: 0,
    estimatedCommission: 0,
    conversionRate: 0,
    dailyData: [],
    trafficSources: [],
    topProducts: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500">Real-time performance metrics from your database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold mt-1">{stats.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Eye className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Affiliate Clicks</p>
              <p className="text-2xl font-bold mt-1">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <MousePointerClick className="text-purple-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Est. Commission</p>
              <p className="text-2xl font-bold mt-1">
                Rp{stats.estimatedCommission.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <DollarSign className="text-orange-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Visitor & Click Trends */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-4">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="#0A0A0A" name="Visitors" />
              <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#8B5CF6" name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.trafficSources.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h3 className="font-semibold">🏆 Top Performing Products</h3>
          <p className="text-sm text-gray-500">Products with highest engagement (real data)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Product</th>
                <th className="text-left p-4 text-sm font-semibold">Views</th>
                <th className="text-left p-4 text-sm font-semibold">Clicks</th>
                <th className="text-left p-4 text-sm font-semibold">Conversion</th>
                <th className="text-left p-4 text-sm font-semibold">Est. Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product: any, index: number) => {
                const conversion = product.views > 0 ? ((product.clicks / product.views) * 100).toFixed(1) : 0
                const revenue = product.price * product.clicks * 0.1
                return (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.views.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">{product.clicks.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="text-green-600 font-medium">{conversion}%</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      Rp{Math.round(revenue).toLocaleString('id-ID')}
                    </td>
                  </tr>
                )
              })}
              {stats.topProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No data yet. Start getting affiliate clicks!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}