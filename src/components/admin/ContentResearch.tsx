'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
// import ContentScheduler from './ContentScheduler'

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

interface GeneratedContent {
  title: string
  excerpt: string
  content: string
  thumbnail: string
  tags: string[]
  seo: {
    title: string
    description: string
    keywords: string
  }
  readTime: number
  qualityScore: number
  wordCount: number
}

export default function ContentResearch() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null)
  const [activeTab, setActiveTab] = useState<'research' | 'custom' | 'scheduler'>('research')
  const [customTopic, setCustomTopic] = useState('')
  const [customCategory, setCustomCategory] = useState('AI & Machine Learning')
  const [customKeywords, setCustomKeywords] = useState('')

  const categories = [
    'all',
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

  const researchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/content/research?category=${selectedCategory}&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        setTopics(data.topics)
        toast.success(`Found ${data.topics.length} trending topics!`)
      } else {
        toast.error(data.error || 'Failed to research topics')
      }
    } catch (error) {
      toast.error('Failed to research topics')
      console.error('Research error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async (topic: TrendingTopic) => {
    setGenerating(true)
    setSelectedTopic(topic)
    setGeneratedContent(null)
    
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.title,
          category: topic.category,
          keywords: topic.keywords,
          tone: 'professional',
          length: 'medium',
          includeCode: ['Web Development', 'AI & Machine Learning', 'DevOps'].includes(topic.category)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('Generated content:', data.content)
        console.log('Content length:', data.content.content.length)
        setGeneratedContent(data.content)
        toast.success('Content generated successfully!')
      } else {
        console.error('Generation failed:', data)
        toast.error(data.error || 'Failed to generate content')
      }
    } catch (error) {
      toast.error('Failed to generate content')
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const generateCustomContent = async () => {
    if (!customTopic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setGenerating(true)
    try {
      const keywords = customKeywords.split(',').map(k => k.trim()).filter(k => k)
      if (keywords.length === 0) {
        keywords.push(customTopic.toLowerCase())
      }

      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          category: customCategory,
          keywords: keywords,
          tone: 'professional',
          length: 'medium',
          includeCode: ['Web Development', 'AI & Machine Learning', 'DevOps'].includes(customCategory)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('Generated content:', data.content)
        console.log('Content length:', data.content.content.length)
        setGeneratedContent(data.content)
        // Create a mock topic for saving
        setSelectedTopic({
          title: customTopic,
          source: 'Custom Input',
          url: '',
          score: 100,
          comments: 0,
          category: customCategory,
          keywords: keywords,
          difficulty: 'medium',
          cpcPotential: 'medium'
        })
        toast.success('Content generated successfully!')
      } else {
        console.error('Generation failed:', data)
        toast.error(data.error || 'Failed to generate content')
      }
    } catch (error) {
      toast.error('Failed to generate content')
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const createPost = async () => {
    if (!generatedContent || !selectedTopic) {
      toast.error('No content to save')
      return
    }
    
    try {
      console.log('Creating post with data:', {
        title: generatedContent.title,
        contentLength: generatedContent.content.length,
        category: selectedTopic.category,
        tags: generatedContent.tags
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          category: selectedTopic.category,
          tags: generatedContent.tags,
          thumbnail: generatedContent.thumbnail,
          author: 'TechBlog Admin',
          published: false
        })
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        toast.success('Draft post created! Review and publish when ready.')
        setGeneratedContent(null)
        setSelectedTopic(null)
      } else {
        toast.error(data.error || 'Failed to create post')
        console.error('API Error:', data)
      }
    } catch (error) {
      toast.error('Failed to create post')
      console.error('Create post error:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-glass-black rounded-lg p-1">
        <button
          onClick={() => setActiveTab('research')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'research'
              ? 'bg-neon-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🔍 Topic Research
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'custom'
              ? 'bg-neon-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ✍️ Custom Topic
        </button>
        <button
          onClick={() => setActiveTab('scheduler')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scheduler'
              ? 'bg-neon-blue text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📅 Bulk Scheduler
        </button>
      </div>

      {activeTab === 'research' ? (
        <div className="space-y-8">
          {/* Research Controls */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">AI Content Research</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-glass-black border border-white/10 rounded-lg text-white focus:border-neon-blue focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={researchTopics}
                disabled={loading}
                className="px-6 py-2"
              >
                {loading ? 'Researching...' : 'Research Topics'}
              </Button>
            </div>

            <p className="text-gray-400 text-sm">
              Research trending topics from HackerNews, Reddit, and tech trends.
            </p>
          </GlassCard>

          {/* Topics List */}
          {topics.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Trending Topics ({topics.length})</h3>
              
              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-white/10 rounded-lg p-4 hover:border-neon-blue/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold text-lg flex-1 mr-4">
                        {topic.title}
                      </h4>
                      <Button
                        onClick={() => generateContent(topic)}
                        disabled={generating}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        {generating && selectedTopic === topic ? 'Generating...' : 'Generate Article'}
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      <span>Source: {topic.source}</span>
                      <span>Score: {topic.score}</span>
                      <span>Comments: {topic.comments}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                        {topic.category}
                      </span>
                      {topic.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Generated Content Preview */}
          {generatedContent && (
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Generated Content</h3>
                <div className="flex gap-2">
                  <Button onClick={createPost} variant="primary">
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={() => setGeneratedContent(null)}
                    variant="secondary"
                  >
                    Discard
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Title</h4>
                  <div className="text-white bg-glass-black p-3 rounded">
                    {generatedContent.title}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Content Preview</h4>
                  <div className="max-h-64 overflow-y-auto p-4 bg-glass-black rounded border border-white/10">
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {generatedContent.content.substring(0, 500)}...
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      ) : activeTab === 'custom' ? (
        <div className="space-y-8">
          {/* Custom Topic Input */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">✍️ Custom Topic Generator</h2>
            <p className="text-gray-400 mb-6">
              Have a specific topic or title in mind? Enter it below and let AI create a comprehensive article for you.
            </p>
            
            <div className="space-y-4">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Article Topic or Title <span className="text-neon-pink">*</span>
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., 'Complete Guide to React Hooks' or 'Machine Learning for Beginners'"
                  className="w-full px-4 py-3 bg-glass-black border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-glass-black border border-white/20 rounded-lg text-white focus:border-neon-blue focus:outline-none"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category} className="bg-gray-900">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keywords Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Keywords (Optional)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g., react, hooks, useState, useEffect (comma-separated)"
                  className="w-full px-4 py-3 bg-glass-black border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20"
                />
                <p className="text-gray-500 text-sm mt-1">
                  If left empty, keywords will be automatically generated from your topic
                </p>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={generateCustomContent}
                  disabled={generating || !customTopic.trim()}
                  className="px-8 py-3 text-lg"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Article...
                    </>
                  ) : (
                    '🚀 Generate Article'
                  )}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Generated Content Preview */}
          {generatedContent && (
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Generated Article</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>📖 {generatedContent.readTime} min read</span>
                    <span>📝 {generatedContent.wordCount} words</span>
                    <span>⭐ {generatedContent.qualityScore}% quality</span>
                  </div>
                </div>
                <Button onClick={createPost} variant="primary">
                  💾 Save as Draft
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Article Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Title:</span>
                      <p className="text-white font-medium">{generatedContent.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Excerpt:</span>
                      <p className="text-gray-300 text-sm">{generatedContent.excerpt}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {generatedContent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Content Preview</h4>
                  <div className="max-h-64 overflow-y-auto p-4 bg-glass-black rounded border border-white/10">
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {generatedContent.content.substring(0, 500)}...
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-4">Bulk Scheduler Coming Soon</h3>
          <p className="text-gray-400">Advanced bulk content scheduling will be available soon.</p>
        </div>
      )}
    </div>
  )
}
