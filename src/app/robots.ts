import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') 
        ? process.env.NEXT_PUBLIC_SITE_URL 
        : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://techblog-murex.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
