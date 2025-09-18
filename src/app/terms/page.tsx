'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import GlassCard from '@/components/ui/GlassCard'

export default function TermsPage() {
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
              <span className="neon-text">Terms</span>
              <span className="text-white"> of Service</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms carefully before using TechBlog.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: September 18, 2025</p>
          </motion.div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Acceptance of Terms</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    By accessing and using TechBlog ("the Service"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p>
                    These Terms of Service ("Terms") govern your use of our website located at https://techblog-murex.vercel.app 
                    (the "Service") operated by TechBlog by Tech Trend Innovation ("us", "we", or "our").
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Use License */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Use License</h2>
                <div className="space-y-4 text-gray-300">
                  <p>Permission is granted to temporarily download one copy of TechBlog materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                  <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* User Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">User Content</h2>
                <div className="space-y-4 text-gray-300">
                  <p>Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
                  <p>By posting Content to the Service, You grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.</p>
                  <div className="mt-6 p-4 bg-glass-black rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-neon-purple mb-2">Prohibited Content</h4>
                    <p className="text-sm">You may not post content that is illegal, harmful, threatening, abusive, defamatory, vulgar, obscene, or otherwise objectionable.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Disclaimer</h2>
                <div className="space-y-4 text-gray-300">
                  <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>excludes all representations and warranties relating to this website and its contents</li>
                    <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
                  </ul>
                  <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-300">
                      <strong>Important:</strong> The materials on TechBlog's website are provided "as is". TechBlog makes no warranties, 
                      expressed or implied, and hereby disclaims and negates all other warranties.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Limitations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Limitations</h2>
                <div className="space-y-4 text-gray-300">
                  <p>In no event shall TechBlog or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TechBlog's website.</p>
                  <p>Some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Governing Law</h2>
                <div className="space-y-4 text-gray-300">
                  <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which TechBlog operates and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
                  <p>Any legal action or proceeding arising under these Terms will be brought exclusively in courts located in our jurisdiction, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Changes to Terms</h2>
                <div className="space-y-4 text-gray-300">
                  <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
                  <p>What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <GlassCard className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Questions About These Terms?</h2>
                <p className="text-gray-300 mb-6">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <motion.a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium rounded-lg neon-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.a>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
