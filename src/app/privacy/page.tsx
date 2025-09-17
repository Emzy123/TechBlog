'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import GlassCard from '@/components/ui/GlassCard'

export default function PrivacyPage() {
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
              <span className="neon-text">Privacy</span>
              <span className="text-white"> Policy</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: September 16, 2025</p>
          </motion.div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Information We Collect</h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-neon-blue mb-2">Personal Information</h3>
                    <p>When you contact us or subscribe to our newsletter, we may collect:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Name and email address</li>
                      <li>Message content when you contact us</li>
                      <li>Any other information you voluntarily provide</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neon-blue mb-2">Automatically Collected Information</h3>
                    <p>We automatically collect certain information when you visit our site:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>IP address and browser information</li>
                      <li>Pages visited and time spent on site</li>
                      <li>Referring website information</li>
                      <li>Device and operating system information</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* How We Use Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">How We Use Your Information</h2>
                <div className="space-y-4 text-gray-300">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To provide and improve our blog content and services</li>
                    <li>To respond to your inquiries and provide customer support</li>
                    <li>To send newsletters and updates (with your consent)</li>
                    <li>To analyze website usage and improve user experience</li>
                    <li>To prevent fraud and ensure website security</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </GlassCard>
            </motion.div>

            {/* Cookies and Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Cookies and Tracking Technologies</h2>
                <div className="space-y-4 text-gray-300">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve website functionality and performance</li>
                  </ul>
                  <div className="mt-6 p-4 bg-glass-black rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-neon-purple mb-2">Third-Party Services</h4>
                    <p className="text-sm">We use Google Analytics and Google AdSense, which may collect and process data according to their own privacy policies.</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Data Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Information Sharing</h2>
                <div className="space-y-4 text-gray-300">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With service providers who help us operate our website</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>
              </GlassCard>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Your Rights</h2>
                <div className="space-y-4 text-gray-300">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  </ul>
                  <div className="mt-6 p-4 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
                    <p className="text-sm">To exercise these rights, please contact us at <span className="text-neon-blue">privacy@techblog.com</span></p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Data Security</h2>
                <div className="space-y-4 text-gray-300">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Secure hosting and database management</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-400">
                    While we strive to protect your information, no method of transmission over the internet is 100% secure.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <GlassCard className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Questions About This Policy?</h2>
                <p className="text-gray-300 mb-6">
                  If you have any questions about this Privacy Policy, please don't hesitate to contact us.
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
