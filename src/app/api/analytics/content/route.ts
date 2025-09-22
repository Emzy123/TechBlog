import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

// GET /api/analytics/content - Get content performance analytics
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'views'
    const filterCategory = searchParams.get('category') || 'all'
    
    // Build query
    const query: any = {}
    if (filterCategory !== 'all') {
      query.category = filterCategory
    }
    
    // Get basic stats
    const totalPosts = await Post.countDocuments(query)
    const publishedPosts = await Post.countDocuments({ ...query, published: true })
    const draftPosts = await Post.countDocuments({ ...query, published: false })
    
    // Get total views
    const totalViewsResult = await Post.aggregate([
      { $match: { ...query, published: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ])
    const totalViews = totalViewsResult[0]?.totalViews || 0
    const avgViewsPerPost = publishedPosts > 0 ? Math.floor(totalViews / publishedPosts) : 0
    
    // Build sort criteria
    let sortCriteria: any = { views: -1 }
    switch (sortBy) {
      case 'engagement':
        sortCriteria = { views: -1 } // Simplified - in production you'd have engagement metrics
        break
      case 'date':
        sortCriteria = { createdAt: -1 }
        break
      case 'readTime':
        sortCriteria = { views: -1 } // Simplified
        break
      default:
        sortCriteria = { views: -1 }
    }
    
    // Get top performing posts
    const topPerformingPosts = await Post.find({ ...query, published: true })
      .sort(sortCriteria)
      .limit(20)
      .select('title slug views category createdAt')
      .lean()
    
    // Get recent posts
    const recentPosts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title slug views category createdAt published')
      .lean()
    
    // Get category performance
    const categoryPerformance = await Post.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: '$category',
          posts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' }
        }
      },
      { $sort: { totalViews: -1 } }
    ])
    
    // Generate content trends (mock data)
    const contentTrends = generateContentTrends()
    
    const data = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      avgViewsPerPost,
      
      topPerformingPosts: topPerformingPosts.map(post => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        views: post.views,
        category: post.category,
        publishedAt: post.createdAt,
        readTime: Math.floor(Math.random() * 10) + 3, // Mock read time
        engagement: Math.floor(Math.random() * 40) + 60 // Mock engagement 60-100%
      })),
      
      categoryPerformance: categoryPerformance.map(cat => ({
        category: cat._id,
        posts: cat.posts,
        totalViews: cat.totalViews,
        avgViews: Math.floor(cat.avgViews),
        engagement: Math.floor(Math.random() * 30) + 70 // Mock engagement 70-100%
      })),
      
      recentPosts: recentPosts.map(post => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        views: post.views,
        category: post.category,
        publishedAt: post.createdAt,
        published: post.published
      })),
      
      engagementMetrics: {
        avgReadTime: 4.2,
        bounceRate: 42.5,
        shareRate: 8.3,
        commentRate: 3.7
      },
      
      contentTrends
    }
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Content analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content analytics' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    )
  }
}

function generateContentTrends() {
  const trends = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    trends.push({
      date: date.toISOString(),
      posts: Math.floor(Math.random() * 3) + 1, // 1-3 posts per day
      views: Math.floor(Math.random() * 500) + 100 // 100-600 views per day
    })
  }
  
  return trends
}
