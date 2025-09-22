'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface ContentMetrics {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  avgViewsPerPost: number
  topPerformingPosts: Array<{
    _id: string
    title: string
    slug: string
    views: number
    category: string
    publishedAt: string
    readTime: number
    engagement: number
  }>
  categoryPerformance: Array<{
    category: string
    posts: number
    totalViews: number
    avgViews: number
    engagement: number
  }>
  recentPosts: Array<{
    _id: string
    title: string
    slug: string
    views: number
    category: string
    publishedAt: string
    published: boolean
  }>
  engagementMetrics: {
    avgReadTime: number
    bounceRate: number
    shareRate: number
    commentRate: number
  }
  contentTrends: Array<{
    date: string
    posts: number
    views: number
  }>
}

export default function ContentPerformance() {
  const [data, setData] = useState<ContentMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('views')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchContentMetrics()
  }, [sortBy, filterCategory])

  const fetchContentMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/content?sort=${sortBy}&category=${filterCategory}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch content metrics:', error)
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

  const categories = ['all', 'AI & Machine Learning', 'Web Development', 'DevOps', 'Cybersecurity', 'Cloud Computing']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Content Performance</h1>
            <p className="text-gray-400">Detailed post metrics and content analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-glass-black border border-white/20 rounded-lg text-white focus:border-neon-blue focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-900">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-glass-black border border-white/20 rounded-lg text-white focus:border-neon-blue focus:outline-none"
            >
              <option value="views" className="bg-gray-900">Sort by Views</option>
              <option value="engagement" className="bg-gray-900">Sort by Engagement</option>
              <option value="date" className="bg-gray-900">Sort by Date</option>
              <option value="readTime" className="bg-gray-900">Sort by Read Time</option>
            </select>
          </div>
        </div>

        {/* Content Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-gray-400 text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-white">{data?.totalPosts || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-400 text-sm">Published</p>
              <p className="text-2xl font-bold text-white">{data?.publishedPosts || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-gray-400 text-sm">Drafts</p>
              <p className="text-2xl font-bold text-white">{data?.draftPosts || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">👁️</div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{data?.totalViews?.toLocaleString() || '0'}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-400 text-sm">Avg Views/Post</p>
              <p className="text-2xl font-bold text-white">{data?.avgViewsPerPost?.toLocaleString() || '0'}</p>
            </div>
          </GlassCard>
        </div>

        {/* Engagement Metrics */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Engagement Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <p className="text-gray-400 text-sm">Avg Read Time</p>
              <p className="text-xl font-bold text-white">{data?.engagementMetrics?.avgReadTime || '0'}m</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-400 text-sm">Bounce Rate</p>
              <p className="text-xl font-bold text-white">{data?.engagementMetrics?.bounceRate || '0'}%</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📤</div>
              <p className="text-gray-400 text-sm">Share Rate</p>
              <p className="text-xl font-bold text-white">{data?.engagementMetrics?.shareRate || '0'}%</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-400 text-sm">Comment Rate</p>
              <p className="text-xl font-bold text-white">{data?.engagementMetrics?.commentRate || '0'}%</p>
            </div>
          </div>
        </GlassCard>

        {/* Top Performing Posts */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Posts</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-400 pb-3">Post</th>
                  <th className="text-left text-gray-400 pb-3">Category</th>
                  <th className="text-left text-gray-400 pb-3">Views</th>
                  <th className="text-left text-gray-400 pb-3">Engagement</th>
                  <th className="text-left text-gray-400 pb-3">Published</th>
                  <th className="text-left text-gray-400 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.topPerformingPosts?.map((post, index) => (
                  <tr key={post._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{post.title}</p>
                          <p className="text-gray-400 text-sm">{post.readTime}m read</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 text-white">{post.views.toLocaleString()}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                            style={{ width: `${post.engagement}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{post.engagement}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400 text-sm">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <Link href={`/posts/${post.slug}`}>
                          <Button size="sm" variant="secondary">View</Button>
                        </Link>
                        <Link href={`/admin/posts/${post._id}`}>
                          <Button size="sm" variant="primary">Edit</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Category Performance and Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Performance */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Category Performance</h3>
            <div className="space-y-4">
              {data?.categoryPerformance?.map((category, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{category.category}</h4>
                    <span className="text-neon-blue text-sm">{category.posts} posts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Views</p>
                      <p className="text-white font-medium">{category.totalViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Avg Views</p>
                      <p className="text-white font-medium">{category.avgViews.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Engagement</span>
                      <span className="text-white">{category.engagement}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neon-blue to-purple-500"
                        style={{ width: `${category.engagement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Posts */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Posts</h3>
            <div className="space-y-4">
              {data?.recentPosts?.map((post, index) => (
                <div key={post._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-medium truncate">{post.title}</p>
                      {!post.published && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{post.category}</span>
                      <span>{post.views.toLocaleString()} views</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/posts/${post.slug}`}>
                      <Button size="sm" variant="secondary">View</Button>
                    </Link>
                    <Link href={`/admin/posts/${post._id}`}>
                      <Button size="sm" variant="primary">Edit</Button>
                    </Link>
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
