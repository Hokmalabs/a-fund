'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'

export type Profile = {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role: 'investisseur' | 'cooperative' | 'admin'
  kyc_status: 'non_soumis' | 'en_attente' | 'verifie' | 'rejete'
  ville: string | null
  pays: string | null
  solde_wallet: number
  total_investi: number
  total_roi: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [user, userLoading])

  return { profile, loading: userLoading || loading }
}
