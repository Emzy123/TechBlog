import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

interface TrendingTopic {
  title: string
  source: string
  url: string
  score: number
  comments: number
  category: string
  keywords: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  cpcPotential: 'low' | 'medium' | 'high'
}

// GET /api/content/research - Research trending tech topics
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const topics = await researchTrendingTopics(category, limit)
    
    return NextResponse.json({
      success: true,
      topics,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Content research error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to research topics' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    )
  }
}

async function researchTrendingTopics(category: string, limit: number): Promise<TrendingTopic[]> {
  // Generate trending tech topics based on current landscape
  const trendingTopics = [
    'AI Code Generation Tools in 2025',
    'Next.js 15 Performance Optimization',
    'Serverless vs Edge Computing Comparison',
    'React Server Components Best Practices',
    'TypeScript 5.0 New Features Guide',
    'Docker Security Best Practices',
    'GraphQL vs REST API Design',
    'Microservices Architecture Patterns',
    'Cloud Cost Optimization Strategies',
    'DevOps Automation Tools Comparison',
    'Cybersecurity Trends 2025',
    'Machine Learning Deployment Guide',
    'Progressive Web Apps Tutorial',
    'Database Optimization Techniques',
    'Mobile App Development Trends'
  ]
  
  const topics: TrendingTopic[] = trendingTopics.slice(0, limit).map(title => ({
    title,
    source: 'TechTrends',
    url: '',
    score: Math.floor(Math.random() * 100) + 50,
    comments: Math.floor(Math.random() * 50) + 10,
    category: categorizeTopic(title),
    keywords: extractKeywords(title),
    difficulty: assessDifficulty(title),
    cpcPotential: assessCPCPotential(title)
  }))
  
  // Filter by category if specified
  let filteredTopics = category === 'all' 
    ? topics 
    : topics.filter(t => t.category.toLowerCase().includes(category.toLowerCase()))
  
  // Sort by score and CPC potential
  filteredTopics.sort((a, b) => {
    const cpcScore = { high: 3, medium: 2, low: 1 }
    return (b.score + cpcScore[b.cpcPotential] * 10) - (a.score + cpcScore[a.cpcPotential] * 10)
  })
  
  return filteredTopics.slice(0, limit)
}

function categorizeTopic(title: string): string {
  const categories = {
    'AI & Machine Learning': ['ai', 'ml', 'machine learning', 'neural', 'gpt', 'llm'],
    'Web Development': ['react', 'vue', 'angular', 'javascript', 'css', 'html', 'web', 'next.js'],
    'DevOps': ['docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure', 'devops'],
    'Cloud Computing': ['aws', 'azure', 'gcp', 'cloud', 'serverless'],
    'Mobile Development': ['ios', 'android', 'react native', 'flutter', 'mobile'],
    'Cybersecurity': ['security', 'vulnerability', 'encryption', 'auth'],
    'Data Science': ['data', 'analytics', 'visualization', 'sql'],
    'Blockchain': ['blockchain', 'crypto', 'web3', 'ethereum'],
    'General Tech': ['programming', 'software', 'tech', 'development']
  }
  
  const lowerTitle = title.toLowerCase()
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category
    }
  }
  
  return 'General Tech'
}

function extractKeywords(title: string): string[] {
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
  
  const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']
  
  return words
    .filter(word => !stopWords.includes(word))
    .slice(0, 5)
}

function assessDifficulty(title: string): 'easy' | 'medium' | 'hard' {
  const easyKeywords = ['guide', 'tutorial', 'beginner', 'intro', 'basics', 'getting started']
  const hardKeywords = ['advanced', 'deep dive', 'architecture', 'optimization', 'performance', 'security']
  
  const lowerTitle = title.toLowerCase()
  
  if (easyKeywords.some(keyword => lowerTitle.includes(keyword))) return 'easy'
  if (hardKeywords.some(keyword => lowerTitle.includes(keyword))) return 'hard'
  return 'medium'
}

function assessCPCPotential(title: string): 'low' | 'medium' | 'high' {
  const highCPCKeywords = ['enterprise', 'business', 'saas', 'cloud', 'security', 'analytics', 'marketing', 'finance']
  const mediumCPCKeywords = ['development', 'framework', 'tool', 'platform', 'service', 'api']
  
  const lowerTitle = title.toLowerCase()
  
  if (highCPCKeywords.some(keyword => lowerTitle.includes(keyword))) return 'high'
  if (mediumCPCKeywords.some(keyword => lowerTitle.includes(keyword))) return 'medium'
  return 'low'
}