import type { SupabaseClient } from '@supabase/supabase-js'

export async function getInvestmentsByUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*, campaigns(titre, produit, image, slug)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function createInvestment(
  supabase: SupabaseClient,
  data: {
    user_id: string
    campaign_id: string
    montant: number
    roi_expected?: number
    date_retour_prev?: string
  }
) {
  const { data: investment, error } = await supabase
    .from('investments')
    .insert(data)
    .select()
    .single()

  return { data: investment, error }
}

export async function getInvestmentStats(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('montant, roi_actual, status')
    .eq('user_id', userId)

  if (error || !data) return { data: null, error }

  const totalInvesti = data.reduce((sum, inv) => sum + inv.montant, 0)
  const totalROI = data.reduce((sum, inv) => {
    if (inv.status === 'termine' && inv.roi_actual) {
      return sum + Math.round(inv.montant * inv.roi_actual / 100)
    }
    return sum
  }, 0)
  const nombreActifs = data.filter(inv => inv.status === 'actif').length

  return {
    data: { totalInvesti, totalROI, nombreActifs },
    error: null,
  }
}
