'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Button from './Button'

interface User {
  id: string
  username: string
  role: string
}

interface DropdownItem {
  label: string
  href: string
  description?: string
  icon?: string
}

interface NavDropdown {
  label: string
  items: DropdownItem[]
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Navigation structure
  const navigationDropdowns: NavDropdown[] = [
    {
      label: 'Categories',
      items: [
        { label: 'AI & Machine Learning', href: '/category/ai-machine-learning', description: 'Latest in AI and ML', icon: '🤖' },
        { label: 'Web Development', href: '/category/web-development', description: 'Frontend & Backend', icon: '💻' },
        { label: 'Cybersecurity', href: '/category/cybersecurity', description: 'Security & Privacy', icon: '🔒' },
        { label: 'DevOps', href: '/category/devops', description: 'CI/CD & Infrastructure', icon: '⚙️' },
        { label: 'Cloud Computing', href: '/category/cloud-computing', description: 'AWS, Azure, GCP', icon: '☁️' },
        { label: 'Mobile Development', href: '/category/mobile-development', description: 'iOS & Android', icon: '📱' }
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'Tutorials', href: '/tutorials', description: 'Step-by-step guides', icon: '📚' },
        { label: 'Code Examples', href: '/code-examples', description: 'Ready-to-use code', icon: '💾' },
        { label: 'Tools & Libraries', href: '/tools', description: 'Recommended tools', icon: '🛠️' },
        { label: 'Cheat Sheets', href: '/cheat-sheets', description: 'Quick references', icon: '📋' },
        { label: 'Best Practices', href: '/best-practices', description: 'Industry standards', icon: '⭐' }
      ]
    },
    {
      label: 'Learning',
      items: [
        { label: 'Beginner Guides', href: '/learning/beginner', description: 'Start your journey', icon: '🌱' },
        { label: 'Advanced Topics', href: '/learning/advanced', description: 'Deep dive content', icon: '🚀' },
        { label: 'Career Paths', href: '/learning/careers', description: 'Tech career guidance', icon: '💼' },
        { label: 'Certifications', href: '/learning/certifications', description: 'Cert preparation', icon: '🏆' },
        { label: 'Interview Prep', href: '/learning/interviews', description: 'Ace your interviews', icon: '🎯' }
      ]
    }
  ]

  const adminDropdowns: NavDropdown[] = [
    {
      label: 'Content',
      items: [
        { label: 'All Posts', href: '/admin/posts', description: 'Manage all posts', icon: '📝' },
        { label: 'Create Post', href: '/admin/posts/new', description: 'Write new article', icon: '✍️' },
        { label: 'AI Content Hub', href: '/admin?tab=content-research', description: 'AI-powered content', icon: '🤖' },
        { label: 'Categories', href: '/admin/categories', description: 'Manage categories', icon: '📂' },
        { label: 'Tags', href: '/admin/tags', description: 'Manage tags', icon: '🏷️' }
      ]
    },
    {
      label: 'Analytics',
      items: [
        { label: 'Dashboard', href: '/admin', description: 'Overview & stats', icon: '📊' },
        { label: 'Traffic Reports', href: '/admin/analytics/traffic', description: 'Visitor analytics', icon: '📈' },
        { label: 'Content Performance', href: '/admin/analytics/content', description: 'Post metrics', icon: '📋' },
        { label: 'SEO Analysis', href: '/admin/analytics/seo', description: 'SEO insights', icon: '🔍' }
      ]
    },
    {
      label: 'Settings',
      items: [
        { label: 'Site Settings', href: '/admin/settings', description: 'General settings', icon: '⚙️' },
        { label: 'User Management', href: '/admin/users', description: 'Manage users', icon: '👥' },
        { label: 'Media Library', href: '/admin/media', description: 'Images & files', icon: '🖼️' },
        { label: 'Backup & Export', href: '/admin/backup', description: 'Data management', icon: '💾' }
      ]
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'glass-dark backdrop-blur-md' : 'bg-transparent'}
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-bold neon-text"
              whileHover={{ scale: 1.05 }}
            >
              TechBlog
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            <Link 
              href="/" 
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              Home
            </Link>

            {/* Dynamic Navigation Dropdowns */}
            {(user?.role === 'admin' ? adminDropdowns : navigationDropdowns).map((dropdown) => (
              <div key={dropdown.label} className="relative">
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-neon-blue transition-colors duration-200"
                  onClick={() => setActiveDropdown(activeDropdown === dropdown.label ? null : dropdown.label)}
                >
                  <span>{dropdown.label}</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: activeDropdown === dropdown.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === dropdown.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 glass-dark rounded-lg shadow-xl border border-white/10 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {dropdown.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 p-3 rounded-md hover:bg-white/10 transition-colors duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <div className="flex-1">
                              <div className="text-white font-medium group-hover:text-neon-blue transition-colors">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-gray-400 text-sm">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link 
              href="/about" 
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:block text-gray-300">Welcome, {user.username}</span>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-neon-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
