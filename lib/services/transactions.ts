import type { SupabaseClient } from '@supabase/supabase-js'

export async function getTransactionsByUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, campaigns(titre)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function createTransaction(
  supabase: SupabaseClient,
  data: {
    user_id: string
    type: 'depot' | 'investissement' | 'retrait' | 'roi'
    montant: number
    reference: string
    description?: string
    methode_paiement?: string
    campaign_id?: string
    status?: 'en_attente' | 'valide' | 'rejete'
  }
) {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({ status: 'en_attente', ...data })
    .select()
    .single()

  return { data: transaction, error }
}
