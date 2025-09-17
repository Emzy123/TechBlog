'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import GlassCard from '@/components/ui/GlassCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface Post {
  _id: string
  title: string
  excerpt: string
  thumbnail: string
  category: string
  content: string
  tags: string[]
  published: boolean
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    thumbnail: '',
    category: '',
    content: '',
    tags: '',
    published: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const router = useRouter()

  const categories = [
    'AI & Machine Learning',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'Data Science',
    'Cloud Computing',
    'IoT',
    'General Tech',
    'Announcement'
  ]

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        const postData = data.post
        setPost(postData)
        setFormData({
          title: postData.title,
          excerpt: postData.excerpt,
          thumbnail: postData.thumbnail,
          category: postData.category,
          content: postData.content,
          tags: postData.tags?.join(', ') || '',
          published: postData.published
        })
      } else {
        toast.error('Post not found')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('Failed to fetch post')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, thumbnail: url }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Post updated successfully!')
        router.push('/admin')
      } else {
        toast.error(data.error || 'Failed to update post')
      }
    } catch (error) {
      toast.error('An error occurred while updating the post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
          <Button onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Edit Post
            </h1>
            <p className="text-gray-400">
              Update your blog post content and settings.
            </p>
          </motion.div>

          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Input
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title for your post"
                required
              />

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Excerpt <span className="text-neon-pink">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a brief summary of your post (max 300 characters)"
                  required
                  maxLength={300}
                  rows={3}
                  className="w-full px-4 py-3 glass rounded-lg bg-glass-black text-white placeholder-gray-400 border border-white/20 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200 resize-none"
                />
                <p className="text-xs text-gray-400">
                  {formData.excerpt.length}/300 characters
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Thumbnail <span className="text-neon-pink">*</span>
                </label>
                <div className="flex space-x-3">
                  <Input
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg or upload file"
                    required
                    className="flex-1"
                  />
                  <label htmlFor="thumbnail-upload-edit" className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="thumbnail-upload-edit"
                    />
                    <div className="px-4 py-2 glass rounded-lg bg-glass-black text-white border border-white/20 hover:border-neon-blue hover:bg-white/10 transition-all duration-200 text-sm font-medium whitespace-nowrap">
                      📁 Upload
                    </div>
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Category <span className="text-neon-pink">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-lg bg-gray-900 text-white border border-white/20 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
                >
                  <option value="" className="bg-gray-900 text-gray-400">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-900 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, javascript, tutorial (comma-separated)"
              />

              {/* Content */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Content <span className="text-neon-pink">*</span>
                </label>
                <div className="glass rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    placeholder="Write your blog post content here..."
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 text-neon-blue bg-glass-black border-white/20 rounded focus:ring-neon-blue focus:ring-2"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-200">
                  Published
                </label>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/admin')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
