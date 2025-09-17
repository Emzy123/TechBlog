'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import GlassCard from './ui/GlassCard'

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

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/posts/${post._id}`}>
        <GlassCard className="h-full overflow-hidden group cursor-pointer">
          {/* Thumbnail */}
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-medium bg-neon-blue/20 text-neon-blue rounded-full backdrop-blur-sm border border-neon-blue/30">
                {post.category}
              </span>
            </div>

            {/* Views */}
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 text-xs bg-black/50 text-white rounded backdrop-blur-sm">
                {post.views} views
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-300 text-sm line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-neon-purple">{post.author}</span>
                <span>•</span>
                <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs bg-glass-white text-gray-300 rounded border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-400">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
