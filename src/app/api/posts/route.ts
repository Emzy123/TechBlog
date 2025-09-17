import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { getAuthUser, requireAdmin } from '@/lib/auth'
import slugify from 'slugify'

// GET /api/posts - Get all posts (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = {}
    if (category) query.category = category
    if (published !== null) query.published = published === 'true'
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Post.countDocuments(query)
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    await dbConnect()
    
    const postData = await request.json()
    
    // Auto-generate slug from title
    const slug = slugify(postData.title, { lower: true, strict: true })
    
    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    
    const post = new Post({
      ...postData,
      slug: uniqueSlug
    })
    await post.save()
    
    return NextResponse.json({
      message: 'Post created successfully',
      post,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create post error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
