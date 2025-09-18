"use client"

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cookie-consent:v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY)
      if (!val) setVisible(true)
    } catch {
      // ignore
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ acceptedAt: Date.now() }))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-300">
            We use cookies to improve your experience, analyze traffic, and personalize content. By clicking "Accept", you consent to our use of cookies. Read our{' '}
            <a href="/privacy" className="text-neon-blue hover:text-neon-purple underline">Privacy Policy</a>.
          </p>
          <div className="flex items-center gap-2">
            <button onClick={accept} className="px-4 py-2 rounded-lg bg-neon-blue text-white hover:bg-neon-purple transition-colors">
              Accept
            </button>
            <a href="/privacy" className="px-4 py-2 rounded-lg border border-white/10 text-gray-200 hover:bg-white/10 transition-colors">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
