import type { MetadataRoute } from 'next'

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (!envUrl) return 'http://localhost:3000'
  return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]

  // Try to include posts dynamically; fail silently if API is not available
  let postRoutes: MetadataRoute.Sitemap = []
  try {
    // Only fetch posts if we're in a server environment and DB is available
    if (process.env.MONGODB_URI) {
      const dbConnect = (await import('@/lib/mongodb')).default
      const Post = (await import('@/models/Post')).default
      
      await dbConnect()
      const posts = await Post.find({ published: true })
        .select('_id updatedAt')
        .limit(100)
        .lean()
      
      postRoutes = posts.map((p: any) => ({
        url: `${baseUrl}/posts/${p._id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (e) {
    // ignore; return static routes only
    console.log('Sitemap: Could not fetch posts, returning static routes only')
  }

  return [...staticRoutes, ...postRoutes]
}
