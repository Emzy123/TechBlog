'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  type?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = false,
  className = ''
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-neon-pink ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 glass rounded-lg
          bg-glass-black text-white placeholder-gray-400
          border border-white/20 focus:border-neon-blue
          focus:outline-none focus:ring-2 focus:ring-neon-blue/20
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
      />
      {error && (
        <motion.p
          className="text-red-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
