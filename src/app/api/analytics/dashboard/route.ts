import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    // Get basic post stats
    const totalPosts = await Post.countDocuments()
    const publishedPosts = await Post.countDocuments({ published: true })
    
    // Get top posts by views
    const topPosts = await Post.find({ published: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views')
      .lean()
    
    // Calculate total views
    const totalViewsResult = await Post.aggregate([
      { $match: { published: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ])
    const totalViews = totalViewsResult[0]?.totalViews || 0
    
    // Get category stats
    const categoryStats = await Post.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: '$category',
          posts: { $sum: 1 },
          views: { $sum: '$views' }
        }
      },
      { $sort: { views: -1 } }
    ])
    
    // Generate mock views over time data (in production, you'd track this)
    const viewsOverTime = generateMockTimeSeriesData(range, totalViews)
    
    // Generate mock recent activity
    const recentActivity = [
      {
        action: 'New post published',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: 'AI & Machine Learning article went live'
      },
      {
        action: 'High traffic spike',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        details: '500+ visitors in the last hour'
      },
      {
        action: 'SEO optimization completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        details: 'Meta descriptions updated for 10 posts'
      },
      {
        action: 'New subscriber',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        details: 'Newsletter subscription from organic search'
      }
    ]
    
    const data = {
      totalViews,
      totalPosts,
      totalUsers: Math.floor(totalViews * 0.7), // Estimate unique users
      avgReadTime: 4.2,
      topPosts: topPosts.map(post => ({
        title: post.title,
        views: post.views,
        slug: post.slug
      })),
      recentActivity,
      viewsOverTime,
      categoryStats: categoryStats.map(cat => ({
        category: cat._id,
        posts: cat.posts,
        views: cat.views
      }))
    }
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    )
  }
}

function generateMockTimeSeriesData(range: string, totalViews: number) {
  const data = []
  const now = new Date()
  let days = 7
  
  switch (range) {
    case '24h':
      days = 1
      break
    case '7d':
      days = 7
      break
    case '30d':
      days = 30
      break
    case '90d':
      days = 90
      break
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic view distribution
    const baseViews = Math.floor(totalViews / days)
    const variance = Math.random() * 0.4 - 0.2 // ±20% variance
    const views = Math.max(0, Math.floor(baseViews * (1 + variance)))
    
    data.push({
      date: date.toISOString(),
      views
    })
  }
  
  return data
}
