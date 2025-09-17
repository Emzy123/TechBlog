'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false 
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        glass rounded-xl p-6 
        ${glow ? 'neon-glow' : ''} 
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 0 30px rgba(0, 245, 255, 0.4)' 
      } : {}}
    >
      {children}
    </motion.div>
  )
}
