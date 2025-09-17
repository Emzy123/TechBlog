'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import GlassCard from '@/components/ui/GlassCard'

export default function AboutPage() {
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
              <span className="neon-text">About</span>
              <span className="text-white"> TechBlog</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exploring the future of technology with cutting-edge insights and futuristic perspectives.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                TechBlog is your gateway to the future of technology. We're dedicated to bringing you 
                the latest insights, innovations, and breakthroughs in the world of tech. From artificial 
                intelligence and machine learning to web development and cybersecurity, we cover it all 
                with a futuristic perspective.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to make complex technology accessible, understandable, and exciting for 
                everyone. Whether you're a seasoned developer, a tech enthusiast, or someone just 
                starting their journey in the digital world, TechBlog has something for you.
              </p>
            </GlassCard>
          </motion.div>

          {/* What We Cover */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold text-white mb-8">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'AI & Machine Learning',
                    description: 'Latest developments in artificial intelligence, neural networks, and ML algorithms.'
                  },
                  {
                    title: 'Web Development',
                    description: 'Modern frameworks, best practices, and emerging web technologies.'
                  },
                  {
                    title: 'Mobile Development',
                    description: 'iOS, Android, and cross-platform mobile app development trends.'
                  },
                  {
                    title: 'DevOps & Cloud',
                    description: 'Infrastructure, deployment strategies, and cloud computing innovations.'
                  },
                  {
                    title: 'Cybersecurity',
                    description: 'Security threats, protection strategies, and privacy in the digital age.'
                  },
                  {
                    title: 'Blockchain & Crypto',
                    description: 'Distributed ledger technology, cryptocurrencies, and Web3 developments.'
                  }
                ].map((topic, index) => (
                  <motion.div
                    key={topic.title}
                    className="glass-dark p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-neon-blue mb-3">{topic.title}</h3>
                    <p className="text-gray-400">{topic.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Values */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold text-white mb-8">Our Values</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-neon-blue font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Innovation First</h3>
                    <p className="text-gray-300">We focus on cutting-edge technologies and emerging trends that shape the future.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neon-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-neon-purple font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
                    <p className="text-gray-300">Complex topics made simple and understandable for all skill levels.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-neon-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-neon-pink font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Quality Content</h3>
                    <p className="text-gray-300">Well-researched, accurate, and practical content that adds real value.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
              <p className="text-gray-300 text-lg mb-6">
                Have questions, suggestions, or want to contribute? We'd love to hear from you!
              </p>
              <motion.a
                href="/contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium rounded-lg neon-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
