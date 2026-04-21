import type { SupabaseClient } from '@supabase/supabase-js'

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    nom?: string
    prenom?: string
    telephone?: string
    ville?: string
    pays?: string
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export async function updateWalletBalance(
  supabase: SupabaseClient,
  userId: string,
  amount: number
) {
  // Fetch current balance first to apply delta
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('solde_wallet')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) return { data: null, error: fetchError }

  const { data, error } = await supabase
    .from('profiles')
    .update({ solde_wallet: profile.solde_wallet + amount })
    .eq('id', userId)
    .select('solde_wallet')
    .single()

  return { data, error }
}
