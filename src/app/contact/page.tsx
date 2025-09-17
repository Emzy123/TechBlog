'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import GlassCard from '@/components/ui/GlassCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="neon-text">Contact</span>
              <span className="text-white"> Us</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a question, suggestion, or want to collaborate? We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      Message <span className="text-neon-pink">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      required
                      rows={6}
                      className="w-full px-4 py-3 glass rounded-lg bg-glass-black text-white placeholder-gray-400 border border-white/20 focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Contact Details */}
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-blue text-lg">📧</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-300">techtrendinnovation0@gmail.com</p>
                      <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-purple text-lg">🌐</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Social Media</h3>
                      <p className="text-gray-300">Follow us for updates</p>
                      <div className="flex space-x-3 mt-2">
                        <a href="#" className="text-neon-blue hover:text-neon-purple transition-colors">Twitter</a>
                        <a href="#" className="text-neon-blue hover:text-neon-purple transition-colors">LinkedIn</a>
                        <a href="#" className="text-neon-blue hover:text-neon-purple transition-colors">GitHub</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-neon-pink/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-pink text-lg">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Response Time</h3>
                      <p className="text-gray-300">Usually within 24 hours</p>
                      <p className="text-gray-400 text-sm">Monday - Friday, 9 AM - 6 PM UTC</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* FAQ */}
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-2">Want to contribute?</h3>
                    <p className="text-gray-300 text-sm">We're always looking for guest writers and contributors. Send us your ideas!</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-2">Found a bug?</h3>
                    <p className="text-gray-300 text-sm">Report technical issues and we'll fix them as soon as possible.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neon-blue mb-2">Business inquiries?</h3>
                    <p className="text-gray-300 text-sm">For partnerships, sponsorships, or advertising opportunities.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
