'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  )
}

// Banner Ad Component
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-gray-400 text-xs mb-2">Advertisement</p>
      <AdSense
        adSlot="1234567890"
        adFormat="horizontal"
        className="min-h-[90px] bg-glass-black rounded-lg border border-white/10 flex items-center justify-center"
      />
    </div>
  )
}

// Sidebar Ad Component
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-gray-400 text-xs mb-2">Advertisement</p>
      <AdSense
        adSlot="0987654321"
        adFormat="vertical"
        className="min-h-[250px] bg-glass-black rounded-lg border border-white/10 flex items-center justify-center"
      />
    </div>
  )
}

// In-Article Ad Component
export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center my-8 ${className}`}>
      <p className="text-gray-400 text-xs mb-2">Advertisement</p>
      <AdSense
        adSlot="1122334455"
        adFormat="rectangle"
        className="min-h-[280px] bg-glass-black rounded-lg border border-white/10 flex items-center justify-center"
      />
    </div>
  )
}
