'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import PostCard from '@/components/PostCard'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface Post {
  _id: string
  title: string
  excerpt: string
  thumbnail: string
  category: string
  author: string
  createdAt: string
  views: number
  tags: string[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = [
    'All',
    'AI & Machine Learning',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'Data Science',
    'Cloud Computing',
    'IoT',
    'General Tech'
  ]

  useEffect(() => {
    if (pagination?.page) {
      fetchPosts()
    }
  }, [pagination?.page, selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        published: 'true'
      })
      
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      
      setPosts(data.posts || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="neon-text">Tech</span>
              <span className="text-white">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Exploring the future of technology with cutting-edge insights, 
              AI innovations, and digital transformation stories.
            </p>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-32 left-10 w-20 h-20 bg-neon-blue/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-48 right-16 w-32 h-32 bg-neon-purple/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-64 left-1/3 w-16 h-16 bg-neon-pink/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Explore Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (selectedCategory === '' && category === 'All') ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleCategoryChange(category === 'All' ? '' : category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="glass rounded-xl h-96 bg-glass-white"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <PostCard key={post._id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-12">
                  <GlassCard className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(pagination.pages)].map((_, i) => {
                        const page = i + 1
                        if (
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= pagination.page - 1 && page <= pagination.page + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          )
                        } else if (
                          page === pagination.page - 2 ||
                          page === pagination.page + 2
                        ) {
                          return <span key={page} className="text-gray-400">...</span>
                        }
                        return null
                      })}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <GlassCard className="max-w-2xl mx-auto p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-neon-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Welcome to TechBlog!</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    {selectedCategory && selectedCategory !== 'All'
                      ? `No posts found in the "${selectedCategory}" category yet.`
                      : 'Your futuristic tech blog is ready! Connect your database to start publishing amazing content.'
                    }
                  </p>
                </div>
                
                <div className="space-y-4 text-left bg-glass-black/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-neon-blue mb-3">Next Steps:</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>• 🗄️ Configure MongoDB Atlas connection</p>
                    <p>• 👤 Create your admin account</p>
                    <p>• ✍️ Start writing your first blog post</p>
                    <p>• 🚀 Share your insights with the world</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/login" className="inline-block">
                    <Button variant="primary" size="lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </section>

      {/* AdSense Ad Placeholder */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="text-center py-8">
            <p className="text-gray-400 text-sm mb-2">Advertisement</p>
            <div className="h-32 bg-glass-black rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Google AdSense Ad Space</p>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  )
}
