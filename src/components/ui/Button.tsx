'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = 'glass rounded-lg font-medium transition-all duration-200 border-0 cursor-pointer'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white neon-glow',
    secondary: 'bg-glass-white text-white border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ 
        duration: 0.1,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.button>
  )
}
