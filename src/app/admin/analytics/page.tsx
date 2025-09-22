'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import GlassCard from '@/components/ui/GlassCard'

interface AnalyticsData {
  totalViews: number
  totalPosts: number
  totalUsers: number
  avgReadTime: number
  topPosts: Array<{
    title: string
    views: number
    slug: string
  }>
  recentActivity: Array<{
    action: string
    timestamp: string
    details: string
  }>
  viewsOverTime: Array<{
    date: string
    views: number
  }>
  categoryStats: Array<{
    category: string
    posts: number
    views: number
  }>
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Overview & stats for your blog performance</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-neon-blue text-white'
                    : 'bg-glass-black text-gray-300 hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-white">{data?.totalViews?.toLocaleString() || '0'}</p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
            <div className="mt-2 text-sm text-green-400">+12.5% from last period</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-white">{data?.totalPosts || '0'}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
            <div className="mt-2 text-sm text-green-400">+3 new this week</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Read Time</p>
                <p className="text-3xl font-bold text-white">{data?.avgReadTime || '0'}m</p>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
            <div className="mt-2 text-sm text-blue-400">+0.5m from last period</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{data?.totalUsers || '0'}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-2 text-sm text-green-400">+8.2% from last period</div>
          </GlassCard>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Views Over Time Chart */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Views Over Time</h3>
            <div className="h-64 flex items-end space-x-2">
              {data?.viewsOverTime?.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-neon-blue to-blue-400 rounded-t"
                    style={{
                      height: `${(item.views / Math.max(...(data.viewsOverTime?.map(d => d.views) || [1]))) * 200}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Posts */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Performing Posts</h3>
            <div className="space-y-4">
              {data?.topPosts?.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{post.title}</p>
                    <p className="text-gray-400 text-sm">{post.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄'}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Category Performance and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Stats */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Category Performance</h3>
            <div className="space-y-3">
              {data?.categoryStats?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-blue to-purple-500"></div>
                    <span className="text-white">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{category.posts} posts</div>
                    <div className="text-gray-400 text-sm">{category.views.toLocaleString()} views</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {data?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-neon-blue mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.details}</p>
                    <p className="text-gray-500 text-xs">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
