'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface SEOMetrics {
  overallScore: number
  totalKeywords: number
  rankingKeywords: number
  organicTraffic: number
  clickThroughRate: number
  avgPosition: number
  topKeywords: Array<{
    keyword: string
    position: number
    clicks: number
    impressions: number
    ctr: number
    difficulty: 'Easy' | 'Medium' | 'Hard'
  }>
  seoIssues: Array<{
    type: 'error' | 'warning' | 'info'
    title: string
    description: string
    affectedPages: number
    priority: 'High' | 'Medium' | 'Low'
  }>
  pageAnalysis: Array<{
    _id: string
    title: string
    slug: string
    seoScore: number
    metaDescription: string
    wordCount: number
    readabilityScore: number
    issues: string[]
  }>
  competitorAnalysis: Array<{
    domain: string
    organicKeywords: number
    organicTraffic: number
    avgPosition: number
  }>
  backlinks: {
    totalBacklinks: number
    referringDomains: number
    domainAuthority: number
    newBacklinks: number
  }
  technicalSEO: {
    pageSpeed: number
    mobileUsability: number
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
    }
    indexedPages: number
    crawlErrors: number
  }
}

export default function SEOAnalysis() {
  const [data, setData] = useState<SEOMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchSEOMetrics()
  }, [])

  const fetchSEOMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analytics/seo')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error)
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-400'
    if (score >= 60) return 'from-yellow-500 to-yellow-400'
    return 'from-red-500 to-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">SEO Analysis</h1>
            <p className="text-gray-400">Search engine optimization insights and recommendations</p>
          </div>
          
          <Button onClick={fetchSEOMetrics} variant="primary">
            🔄 Refresh Data
          </Button>
        </div>

        {/* SEO Score Overview */}
        <GlassCard className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(data?.overallScore || 0) * 3.14} 314`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f5ff" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(data?.overallScore || 0)}`}>
                      {data?.overallScore || 0}
                    </div>
                    <div className="text-gray-400 text-sm">SEO Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-gray-400 text-sm">Total Keywords</p>
              <p className="text-2xl font-bold text-white">{data?.totalKeywords || '0'}</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-gray-400 text-sm">Ranking Keywords</p>
              <p className="text-2xl font-bold text-white">{data?.rankingKeywords || '0'}</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-gray-400 text-sm">Organic Traffic</p>
              <p className="text-2xl font-bold text-white">{data?.organicTraffic?.toLocaleString() || '0'}</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-gray-400 text-sm">Avg Position</p>
              <p className="text-2xl font-bold text-white">{data?.avgPosition || '0'}</p>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-glass-black rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'keywords', label: '🔍 Keywords', icon: '🔍' },
            { id: 'issues', label: '⚠️ Issues', icon: '⚠️' },
            { id: 'technical', label: '⚙️ Technical', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-neon-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Keywords */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Performing Keywords</h3>
              <div className="space-y-4">
                {data?.topKeywords?.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{keyword.keyword}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          keyword.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          keyword.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {keyword.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>Pos: {keyword.position}</span>
                        <span>Clicks: {keyword.clicks}</span>
                        <span>CTR: {keyword.ctr}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Backlinks Overview */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Backlinks Overview</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{data?.backlinks?.totalBacklinks?.toLocaleString() || '0'}</div>
                  <div className="text-gray-400 text-sm">Total Backlinks</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{data?.backlinks?.referringDomains || '0'}</div>
                  <div className="text-gray-400 text-sm">Referring Domains</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{data?.backlinks?.domainAuthority || '0'}</div>
                  <div className="text-gray-400 text-sm">Domain Authority</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">+{data?.backlinks?.newBacklinks || '0'}</div>
                  <div className="text-gray-400 text-sm">New This Month</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'keywords' && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Keyword Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 pb-3">Keyword</th>
                    <th className="text-left text-gray-400 pb-3">Position</th>
                    <th className="text-left text-gray-400 pb-3">Clicks</th>
                    <th className="text-left text-gray-400 pb-3">Impressions</th>
                    <th className="text-left text-gray-400 pb-3">CTR</th>
                    <th className="text-left text-gray-400 pb-3">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.topKeywords?.map((keyword, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 text-white font-medium">{keyword.keyword}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          keyword.position <= 3 ? 'bg-green-500/20 text-green-400' :
                          keyword.position <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          #{keyword.position}
                        </span>
                      </td>
                      <td className="py-4 text-white">{keyword.clicks.toLocaleString()}</td>
                      <td className="py-4 text-white">{keyword.impressions.toLocaleString()}</td>
                      <td className="py-4 text-white">{keyword.ctr}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          keyword.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          keyword.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {keyword.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            {/* SEO Issues */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">SEO Issues & Recommendations</h3>
              <div className="space-y-4">
                {data?.seoIssues?.map((issue, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    issue.type === 'error' ? 'bg-red-500/10 border-red-500' :
                    issue.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="text-2xl">
                            {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                          </div>
                          <h4 className="text-white font-medium">{issue.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            issue.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                            issue.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {issue.priority}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
                        <p className="text-gray-400 text-xs">Affects {issue.affectedPages} pages</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Page Analysis */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Page SEO Analysis</h3>
              <div className="space-y-4">
                {data?.pageAnalysis?.map((page, index) => (
                  <div key={page._id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{page.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${getScoreColor(page.seoScore)}`}>
                          {page.seoScore}/100
                        </span>
                        <Link href={`/admin/posts/${page._id}`}>
                          <Button size="sm" variant="primary">Edit</Button>
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Word Count</p>
                        <p className="text-white">{page.wordCount} words</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Readability</p>
                        <p className="text-white">{page.readabilityScore}/100</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Issues</p>
                        <p className="text-red-400">{page.issues.length} issues</p>
                      </div>
                    </div>
                    {page.issues.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm mb-2">Issues:</p>
                        <div className="flex flex-wrap gap-2">
                          {page.issues.map((issue, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Core Web Vitals */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Core Web Vitals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Largest Contentful Paint (LCP)</p>
                    <p className="text-gray-400 text-sm">Loading performance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{data?.technicalSEO?.coreWebVitals?.lcp || '0'}s</p>
                    <p className={`text-sm ${(data?.technicalSEO?.coreWebVitals?.lcp || 0) <= 2.5 ? 'text-green-400' : 'text-red-400'}`}>
                      {(data?.technicalSEO?.coreWebVitals?.lcp || 0) <= 2.5 ? 'Good' : 'Needs Work'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">First Input Delay (FID)</p>
                    <p className="text-gray-400 text-sm">Interactivity</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{data?.technicalSEO?.coreWebVitals?.fid || '0'}ms</p>
                    <p className={`text-sm ${(data?.technicalSEO?.coreWebVitals?.fid || 0) <= 100 ? 'text-green-400' : 'text-red-400'}`}>
                      {(data?.technicalSEO?.coreWebVitals?.fid || 0) <= 100 ? 'Good' : 'Needs Work'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Cumulative Layout Shift (CLS)</p>
                    <p className="text-gray-400 text-sm">Visual stability</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{data?.technicalSEO?.coreWebVitals?.cls || '0'}</p>
                    <p className={`text-sm ${(data?.technicalSEO?.coreWebVitals?.cls || 0) <= 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                      {(data?.technicalSEO?.coreWebVitals?.cls || 0) <= 0.1 ? 'Good' : 'Needs Work'}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Technical Metrics */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Technical SEO</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(data?.technicalSEO?.pageSpeed || 0)}`}>
                    {data?.technicalSEO?.pageSpeed || '0'}
                  </div>
                  <div className="text-gray-400 text-sm">Page Speed</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(data?.technicalSEO?.mobileUsability || 0)}`}>
                    {data?.technicalSEO?.mobileUsability || '0'}
                  </div>
                  <div className="text-gray-400 text-sm">Mobile Usability</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{data?.technicalSEO?.indexedPages || '0'}</div>
                  <div className="text-gray-400 text-sm">Indexed Pages</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className={`text-2xl font-bold ${(data?.technicalSEO?.crawlErrors || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {data?.technicalSEO?.crawlErrors || '0'}
                  </div>
                  <div className="text-gray-400 text-sm">Crawl Errors</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  )
}
