'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import Navbar from '@/components/ui/Navbar'
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
  published: boolean
  views: number
}

interface User {
  id: string
  username: string
  role: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.user.role !== 'admin') {
          toast.error('Admin access required')
          router.push('/login')
          return
        }
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts?limit=50')
      const data = await response.json()
      
      setPosts(data.posts || [])
      
      // Calculate stats
      const totalPosts = data.posts?.length || 0
      const publishedPosts = data.posts?.filter((p: Post) => p.published).length || 0
      const draftPosts = totalPosts - publishedPosts
      const totalViews = data.posts?.reduce((sum: number, p: Post) => sum + p.views, 0) || 0
      
      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews
      })
    } catch (error) {
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        fetchPosts()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`)
        fetchPosts()
      } else {
        toast.error('Failed to update post status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user.username}! Manage your blog posts and settings.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="text-center">
              <h3 className="text-2xl font-bold text-neon-blue">{stats.totalPosts}</h3>
              <p className="text-gray-400">Total Posts</p>
            </GlassCard>
            <GlassCard className="text-center">
              <h3 className="text-2xl font-bold text-green-400">{stats.publishedPosts}</h3>
              <p className="text-gray-400">Published</p>
            </GlassCard>
            <GlassCard className="text-center">
              <h3 className="text-2xl font-bold text-yellow-400">{stats.draftPosts}</h3>
              <p className="text-gray-400">Drafts</p>
            </GlassCard>
            <GlassCard className="text-center">
              <h3 className="text-2xl font-bold text-neon-purple">{stats.totalViews}</h3>
              <p className="text-gray-400">Total Views</p>
            </GlassCard>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Manage Posts</h2>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/posts/new')}
            >
              Create New Post
            </Button>
          </div>

          {/* Posts Table */}
          <GlassCard className="overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-glass-black">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {posts.map((post, index) => (
                      <motion.tr
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-glass-white transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white truncate max-w-xs">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {post.excerpt}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs bg-neon-blue/20 text-neon-blue rounded-full">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            post.published 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {post.views}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => router.push(`/admin/posts/${post._id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={post.published ? 'secondary' : 'primary'}
                              size="sm"
                              onClick={() => togglePublishStatus(post._id, post.published)}
                            >
                              {post.published ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">No Posts Yet</h3>
                <p className="text-gray-400 mb-6">Create your first blog post to get started.</p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/admin/posts/new')}
                >
                  Create First Post
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
