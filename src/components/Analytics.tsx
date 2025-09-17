'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics tracking function
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// Page view tracking
export const trackPageView = (url: string) => {
  const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  if (analyticsId) {
    gtag('config', analyticsId, {
      page_path: url,
    })
  }
}

// Event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Custom events for blog interactions
export const trackBlogEvent = {
  viewPost: (postId: string, postTitle: string) => {
    trackEvent('view_post', 'blog', `${postId}:${postTitle}`)
  },
  
  sharePost: (postId: string, platform: string) => {
    trackEvent('share_post', 'social', `${postId}:${platform}`)
  },
  
  searchPosts: (query: string) => {
    trackEvent('search', 'blog', query)
  },
  
  filterCategory: (category: string) => {
    trackEvent('filter_category', 'blog', category)
  },
  
  subscribeNewsletter: (email: string) => {
    trackEvent('subscribe', 'newsletter', 'footer_form')
  },
  
  contactForm: (subject: string) => {
    trackEvent('contact_form', 'engagement', subject)
  },
  
  adminLogin: () => {
    trackEvent('admin_login', 'authentication', 'success')
  }
}

// Analytics component for automatic page tracking
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return null
}
