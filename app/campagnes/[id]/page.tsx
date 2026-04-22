import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CampaignDetailClient from './CampaignDetailClient'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('titre, description_courte, image, produit, region')
    .eq('slug', params.id)
    .single()

  if (!data) return { title: 'Campagne introuvable' }

  const title = `${data.titre} | A-FUND`
  const description = data.description_courte ?? `Investissez dans ${data.produit} — ${data.region}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.image ? [{ url: data.image, width: 800, height: 600 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: data.image ? [data.image] : [],
    },
  }
}

export default function CampaignDetailPage() {
  return <CampaignDetailClient />
}
