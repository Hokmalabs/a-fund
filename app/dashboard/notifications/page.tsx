'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DASHBOARD_NAV } from '@/lib/constants'
import { Bell, TrendingUp, Leaf, FileText, ShieldCheck, Info, CheckCheck, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { getNotificationsByUser, markAllAsRead, markAsRead } from '@/lib/services/notifications'

type NotifType = 'roi' | 'campagne' | 'rapport' | 'kyc' | 'systeme'

const typeIcon: Record<NotifType, React.ReactNode> = {
  roi:      <TrendingUp size={18} className="text-amber-500" />,
  campagne: <Leaf size={18} className="text-green-500" />,
  rapport:  <FileText size={18} className="text-blue-500" />,
  kyc:      <ShieldCheck size={18} className="text-purple-500" />,
  systeme:  <Info size={18} className="text-gray-500" />,
}

const typeBg: Record<NotifType, string> = {
  roi:      'bg-amber-50',
  campagne: 'bg-green-50',
  rapport:  'bg-blue-50',
  kyc:      'bg-purple-50',
  systeme:  'bg-gray-50',
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [notifs, setNotifs] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [filtre, setFiltre] = useState<'toutes' | 'non_lues'>('toutes')

  useEffect(() => {
    if (userLoading) return
    if (!user) { router.push('/auth/login'); return }

    const supabase = createClient()
    getNotificationsByUser(supabase, user.id).then(({ data }) => {
      if (data) setNotifs(data as Record<string, unknown>[])
      setDataLoading(false)
    })
  }, [user, userLoading, router])

  if (userLoading || dataLoading) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Notifications">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const filtered = notifs.filter(n => filtre === 'toutes' || !n.lu)
  const nonLues = notifs.filter(n => !n.lu).length

  const handleMarkAllRead = async () => {
    if (!user) return
    const supabase = createClient()
    await markAllAsRead(supabase, user.id)
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  }

  const handleMarkRead = async (id: string) => {
    const supabase = createClient()
    await markAsRead(supabase, id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  }

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Notifications">
      <div className="space-y-5">

        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltre('toutes')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filtre === 'toutes'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFiltre('non_lues')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5 ${
                filtre === 'non_lues'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              Non lues
              {nonLues > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {nonLues}
                </span>
              )}
            </button>
          </div>

          {nonLues > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm text-green-600 hover:underline font-medium"
            >
              <CheckCheck size={15} />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Liste */}
        <div className="space-y-3">
          {filtered.map(notif => {
            const type = (notif.type as NotifType) ?? 'systeme'
            return (
              <div
                key={notif.id as string}
                className={`card p-4 flex items-start gap-4 transition-all ${
                  !notif.lu ? 'border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${typeBg[type] ?? 'bg-gray-50'}`}>
                  {typeIcon[type] ?? typeIcon.systeme}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!notif.lu ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notif.titre as string}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(notif.created_at as string).toLocaleDateString('fr-CI', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">{notif.message as string}</p>

                  <div className="flex items-center gap-3 mt-2">
                    {(notif.link as string | undefined) && (
                      <Link
                        href={notif.link as string}
                        className="text-xs text-green-600 font-medium hover:underline"
                      >
                        Voir le détail →
                      </Link>
                    )}
                    {!notif.lu && (
                      <button
                        onClick={() => handleMarkRead(notif.id as string)}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                      >
                        <CheckCheck size={12} /> Marquer lu
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteNotif(notif.id as string)}
                  className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors mt-0.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="card p-12 text-center text-gray-400">
              <Bell size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune notification</p>
              <p className="text-sm mt-1">Vous êtes à jour !</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
