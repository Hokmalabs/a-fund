import type { SupabaseClient } from '@supabase/supabase-js'

export async function getCampaigns(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getCampaignBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data, error }
}

export async function getCampaignsByCooperative(supabase: SupabaseClient, cooperativeId: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('cooperative_id', cooperativeId)
    .order('created_at', { ascending: false })

  return { data, error }
}
