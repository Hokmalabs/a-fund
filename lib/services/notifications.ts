import type { SupabaseClient } from '@supabase/supabase-js'

export async function getNotificationsByUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function markAsRead(supabase: SupabaseClient, notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ lu: true })
    .eq('id', notificationId)
    .select()
    .single()

  return { data, error }
}

export async function markAllAsRead(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ lu: true })
    .eq('user_id', userId)
    .eq('lu', false)

  return { error }
}
