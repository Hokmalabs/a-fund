import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://a-fund.ci'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/campagnes`,           lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/blog`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/legal/terms`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const supabase = await createClient()
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('slug, updated_at')
      .neq('status', 'draft')

    const campaignRoutes: MetadataRoute.Sitemap = (campaigns ?? []).map(c => ({
      url: `${BASE_URL}/campagnes/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...campaignRoutes]
  } catch {
    return staticRoutes
  }
}
