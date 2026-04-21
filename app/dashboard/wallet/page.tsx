'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DASHBOARD_NAV } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { getProfile } from '@/lib/services/profiles'
import { getTransactionsByUser } from '@/lib/services/transactions'

export default function WalletPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return
    if (!user) { router.push('/auth/login'); return }

    const supabase = createClient()
    Promise.all([
      getProfile(supabase, user.id),
      getTransactionsByUser(supabase, user.id),
    ]).then(([{ data: p }, { data: txn }]) => {
      if (p) setProfile(p as Record<string, unknown>)
      if (txn) setTransactions(txn as Record<string, unknown>[])
      setDataLoading(false)
    })
  }, [user, userLoading, router])

  if (userLoading || dataLoading) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Mon Wallet">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const recentTx = transactions.slice(0, 5)

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Mon Wallet">
      <div className="space-y-6">

        {/* Solde */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
          <p className="text-green-200 text-sm mb-1">Solde disponible</p>
          <p style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold mb-6">
            {formatCurrency((profile?.solde_wallet as number) ?? 0)}
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard/wallet/deposit"
              className="flex-1 bg-white text-green-700 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
            >
              <ArrowDownLeft size={16} /> Déposer
            </Link>
            <Link
              href="/dashboard/wallet/withdraw"
              className="flex-1 bg-white/20 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            >
              <ArrowUpRight size={16} /> Retirer
            </Link>
          </div>
        </div>

        {/* Statistiques wallet */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Total investi</p>
            <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-gray-800">
              {formatCurrency((profile?.total_investi as number) ?? 0)}
            </p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Total ROI reçu</p>
            <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-green-600">
              {formatCurrency((profile?.total_roi as number) ?? 0)}
            </p>
          </div>
        </div>

        {/* Transactions récentes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 flex items-center gap-2">
              <History size={18} className="text-green-600" /> Transactions récentes
            </h2>
            <Link href="/dashboard/transactions" className="text-xs text-green-600 hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentTx.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Aucune transaction</p>
            )}
            {recentTx.map(tx => (
              <div key={tx.id as string} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.description as string}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.created_at as string).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'depot' || tx.type === 'roi' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'depot' || tx.type === 'roi' ? '+' : '-'}{formatCurrency((tx.montant as number) ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
