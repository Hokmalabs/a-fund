'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { DASHBOARD_NAV } from '@/lib/constants'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Gift, Filter, Search } from 'lucide-react'
import type { TransactionType } from '@/lib/types'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { getTransactionsByUser } from '@/lib/services/transactions'

const typeLabel: Record<TransactionType, string> = {
  depot: 'Dépôt',
  investissement: 'Investissement',
  retrait: 'Retrait',
  roi: 'ROI',
}

const typeVariant: Record<TransactionType, 'success' | 'info' | 'error' | 'warning'> = {
  depot: 'success',
  investissement: 'info',
  retrait: 'error',
  roi: 'warning',
}

const typeIcon: Record<TransactionType, React.ReactNode> = {
  depot: <ArrowDownCircle size={18} className="text-green-500" />,
  investissement: <TrendingUp size={18} className="text-blue-500" />,
  retrait: <ArrowUpCircle size={18} className="text-red-500" />,
  roi: <Gift size={18} className="text-amber-500" />,
}

const typeSign: Record<TransactionType, string> = {
  depot: '+',
  investissement: '-',
  retrait: '-',
  roi: '+',
}

const typeColor: Record<TransactionType, string> = {
  depot: 'text-green-600',
  investissement: 'text-blue-600',
  retrait: 'text-red-600',
  roi: 'text-amber-600',
}

function formatMontant(n: number) {
  return n.toLocaleString('fr-CI') + ' FCFA'
}

export default function TransactionsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [filtre, setFiltre] = useState<'tous' | TransactionType>('tous')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (userLoading) return
    if (!user) { router.push('/auth/login'); return }

    const supabase = createClient()
    getTransactionsByUser(supabase, user.id).then(({ data }) => {
      if (data) setTransactions(data as Record<string, unknown>[])
      setDataLoading(false)
    })
  }, [user, userLoading, router])

  if (userLoading || dataLoading) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Historique des transactions">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const filtered = transactions.filter(txn => {
    const matchType = filtre === 'tous' || txn.type === filtre
    const matchSearch =
      ((txn.description as string) ?? '').toLowerCase().includes(search.toLowerCase()) ||
      ((txn.reference as string) ?? '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalDepots = transactions.filter(t => t.type === 'depot').reduce((s, t) => s + ((t.montant as number) ?? 0), 0)
  const totalRetraits = transactions.filter(t => t.type === 'retrait').reduce((s, t) => s + ((t.montant as number) ?? 0), 0)
  const totalROI = transactions.filter(t => t.type === 'roi').reduce((s, t) => s + ((t.montant as number) ?? 0), 0)

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Historique des transactions">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <ArrowDownCircle className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total dépôts</p>
              <p className="font-bold text-gray-800">{formatMontant(totalDepots)}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <ArrowUpCircle className="text-red-500" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total retraits</p>
              <p className="font-bold text-gray-800">{formatMontant(totalRetraits)}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Gift className="text-amber-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total ROI reçu</p>
              <p className="font-bold text-gray-800">{formatMontant(totalROI)}</p>
            </div>
          </div>
        </div>

        {/* Filtres + Recherche */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {(['tous', 'depot', 'investissement', 'retrait', 'roi'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filtre === f
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                }`}
              >
                {f === 'tous' ? 'Tous' : typeLabel[f]}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-1.5 text-sm w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Transaction</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Référence</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(txn => {
                  const type = txn.type as TransactionType
                  return (
                    <tr key={txn.id as string} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            {typeIcon[type]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{txn.description as string}</p>
                            {(txn.methode_paiement as string | undefined) && (
                              <p className="text-xs text-gray-400 capitalize mt-0.5">
                                {(txn.methode_paiement as string).replace('_', ' ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-mono text-xs">{txn.reference as string}</td>
                      <td className="px-5 py-4">
                        <Badge variant={typeVariant[type]} size="sm">
                          {typeLabel[type]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(txn.created_at as string).toLocaleDateString('fr-CI', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className={`px-5 py-4 text-right font-bold ${typeColor[type]}`}>
                        {typeSign[type]}{formatMontant((txn.montant as number) ?? 0)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <Search size={32} className="mx-auto mb-3 opacity-40" />
                <p>Aucune transaction trouvée.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
