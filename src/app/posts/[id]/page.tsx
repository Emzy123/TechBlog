'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  thumbnail: string
  category: string
  author: string
  createdAt: string
  views: number
  tags: string[]
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const router = useRouter()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : 'http://localhost:3000') as string

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setPost(data.post)
        fetchRelatedPosts(data.post.category)
      } else {
        toast.error('Post not found')
        router.push('/')
      }
    } catch (error) {
      toast.error('Failed to fetch post')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (category: string) => {
    try {
      const response = await fetch(`/api/posts?category=${encodeURIComponent(category)}&limit=3&published=true`)
      const data = await response.json()
      
      if (response.ok) {
        // Filter out current post
        const filtered = data.posts?.filter((p: Post) => p._id !== params.id) || []
        setRelatedPosts(filtered.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch related posts:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-blue"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <GlassCard className="text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
            <Button onClick={() => router.push('/')}>
              Back to Homepage
            </Button>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <article className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article JSON-LD for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                image: [post.thumbnail],
                datePublished: new Date(post.createdAt).toISOString(),
                author: [{ '@type': 'Person', name: post.author }],
                publisher: {
                  '@type': 'Organization',
                  name: 'TechBlog by Tech Trend Innovation',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/favicon.svg`,
                  },
                },
                mainEntityOfPage: `${siteUrl}/posts/${post._id}`,
                url: `${siteUrl}/posts/${post._id}`,
                keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
                articleSection: post.category,
                description: post.excerpt,
              }),
            }}
          />
          {/* Hero Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className="px-4 py-2 text-sm font-medium bg-neon-blue/20 text-neon-blue rounded-full backdrop-blur-sm border border-neon-blue/30">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-neon-purple">{post.author}</span>
              </div>
              <span>•</span>
              <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
              <span>•</span>
              <span>{post.views} views</span>
            </div>

            {/* Thumbnail */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-8 mb-12">
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  color: '#e5e7eb',
                  lineHeight: '1.8'
                }}
              />
            </GlassCard>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-glass-white text-gray-300 rounded-full border border-white/10 hover:border-neon-blue/30 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* AdSense Ad Placeholder */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard className="text-center py-8">
              <p className="text-gray-400 text-sm mb-2">Advertisement</p>
              <div className="h-32 bg-glass-black rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Google AdSense Ad Space</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <GlassCard className="h-full overflow-hidden group cursor-pointer">
                      <div 
                        className="relative h-32 mb-4 rounded-lg overflow-hidden"
                        onClick={() => router.push(`/posts/${relatedPost._id}`)}
                      >
                        <Image
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        <h3 
                          className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors duration-200 line-clamp-2 cursor-pointer"
                          onClick={() => router.push(`/posts/${relatedPost._id}`)}
                        >
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{format(new Date(relatedPost.createdAt), 'MMM dd')}</span>
                          <span>{relatedPost.views} views</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassCard className="p-6 text-center">
              <Button
                variant="primary"
                onClick={() => router.push('/')}
                className="mr-4"
              >
                ← Back to Homepage
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Back to Top
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </article>

      <Footer />

      {/* Custom Styles for Prose */}
      <style jsx global>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h1 { font-size: 2.25rem; }
        .prose h2 { font-size: 1.875rem; }
        .prose h3 { font-size: 1.5rem; }
        .prose p {
          margin-bottom: 1.5rem;
          color: #e5e7eb;
        }
        .prose a {
          color: #00f5ff;
          text-decoration: none;
        }
        .prose a:hover {
          color: #8b5cf6;
          text-decoration: underline;
        }
        .prose code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #00f5ff;
        }
        .prose pre {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
        }
        .prose blockquote {
          border-left: 4px solid #00f5ff;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #d1d5db;
        }
        .prose ul, .prose ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin: 0.5rem 0;
          color: #e5e7eb;
        }
      `}</style>
    </div>
  )
}
