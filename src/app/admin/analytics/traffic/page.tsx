'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface TrafficData {
  totalVisitors: number
  uniqueVisitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  deviceStats: Array<{
    device: string
    visitors: number
    percentage: number
  }>
  locationStats: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  hourlyTraffic: Array<{
    hour: number
    visitors: number
  }>
  realTimeVisitors: number
}

export default function TrafficReports() {
  const [data, setData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTrafficData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchTrafficData, 30000)
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeRange])

  const fetchTrafficData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/traffic?range=${timeRange}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch traffic data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
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
            <h1 className="text-4xl font-bold text-white mb-2">Traffic Reports</h1>
            <p className="text-gray-400">Detailed visitor analytics and traffic insights</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Real-time indicator */}
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live: {data?.realTimeVisitors || 0} visitors</span>
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
        </div>

        {/* Key Traffic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-400 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold text-white">{data?.totalVisitors?.toLocaleString() || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">👤</div>
              <p className="text-gray-400 text-sm">Unique Visitors</p>
              <p className="text-2xl font-bold text-white">{data?.uniqueVisitors?.toLocaleString() || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">👁️</div>
              <p className="text-gray-400 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-white">{data?.pageViews?.toLocaleString() || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-gray-400 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-white">{data?.avgSessionDuration || '0'}m</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-gray-400 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-white">{data?.bounceRate || '0'}%</p>
            </div>
          </GlassCard>
        </div>

        {/* Hourly Traffic Chart */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Hourly Traffic Pattern</h3>
          <div className="h-64 flex items-end space-x-1">
            {Array.from({ length: 24 }, (_, i) => {
              const hourData = data?.hourlyTraffic?.find(h => h.hour === i)
              const visitors = hourData?.visitors || 0
              const maxVisitors = Math.max(...(data?.hourlyTraffic?.map(h => h.visitors) || [1]))
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-neon-blue to-blue-400 rounded-t hover:from-neon-pink hover:to-pink-400 transition-colors cursor-pointer"
                    style={{
                      height: `${(visitors / maxVisitors) * 200}px`,
                      minHeight: '4px'
                    }}
                    title={`${i}:00 - ${visitors} visitors`}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">{i}</div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Traffic Sources and Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Sources */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {data?.trafficSources?.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {source.source === 'Direct' ? '🔗' : 
                       source.source === 'Google' ? '🔍' :
                       source.source === 'Social' ? '📱' :
                       source.source === 'Referral' ? '🌐' : '📊'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{source.source}</p>
                      <p className="text-gray-400 text-sm">{source.visitors.toLocaleString()} visitors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-neon-blue font-bold">{source.percentage}%</div>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neon-blue to-purple-500"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Pages */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Pages</h3>
            <div className="space-y-4">
              {data?.topPages?.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{page.path}</p>
                    <p className="text-gray-400 text-sm">{page.views.toLocaleString()} views • {page.uniqueViews.toLocaleString()} unique</p>
                  </div>
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄'}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Device and Location Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Stats */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {data?.deviceStats?.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {device.device === 'Desktop' ? '💻' : 
                       device.device === 'Mobile' ? '📱' :
                       device.device === 'Tablet' ? '📱' : '🖥️'}
                    </div>
                    <span className="text-white">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{device.visitors.toLocaleString()}</div>
                    <div className="text-neon-blue text-sm">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Location Stats */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Locations</h3>
            <div className="space-y-4">
              {data?.locationStats?.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🌍</div>
                    <span className="text-white">{location.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{location.visitors.toLocaleString()}</div>
                    <div className="text-neon-blue text-sm">{location.percentage}%</div>
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
