import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/ui/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

const siteName = 'TechBlog'
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : 'http://localhost:3000') || 'http://localhost:3000'

export const metadata: Metadata = {
  title: `${siteName} - Futuristic Tech Insights`,
  description: 'A modern, futuristic blog covering the latest in technology, AI, and innovation.',
  keywords: 'technology, blog, AI, innovation, programming, tech news',
  authors: [{ name: 'TechBlog Admin' }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteName} - Futuristic Tech Insights`,
    description: 'A modern, futuristic blog covering the latest in technology, AI, and innovation.',
    type: 'website',
    url: siteUrl,
    siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Futuristic Tech Insights`,
    description: 'A modern, futuristic blog covering the latest in technology, AI, and innovation.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/favicon.svg`,
            }),
          }}
        />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
                `,
              }}
            />
          </>
        )}
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <Analytics />
          {children}
          <CookieConsent />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: '1px solid rgba(0, 245, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
