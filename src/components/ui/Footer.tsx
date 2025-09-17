'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'GitHub', href: '#', icon: '⚡' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
  ]

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.footer
      className="glass-dark mt-20 border-t border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.h3
              className="text-2xl font-bold neon-text mb-4"
              whileHover={{ scale: 1.05 }}
            >
              TechBlog
            </motion.h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Your gateway to the future of technology. Exploring AI, innovation, 
              and the digital frontier with cutting-edge insights and futuristic perspectives.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-2xl hover:text-neon-blue transition-colors duration-200"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-blue transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest tech insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full px-3 py-2 glass rounded-lg bg-glass-black text-white placeholder-gray-400 border border-white/20 focus:border-neon-blue focus:outline-none text-sm disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full px-3 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg text-sm font-medium disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TechBlog. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Built with Next.js & Framer Motion
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
