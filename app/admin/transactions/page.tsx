'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { ADMIN_NAV } from '@/lib/constants'
import { Search, ArrowDownCircle, ArrowUpCircle, TrendingUp, Gift, Download, CheckCircle, XCircle } from 'lucide-react'
import type { TransactionType } from '@/lib/types'

const typeLabel: Record<TransactionType, string> = {
  depot: 'Dépôt', investissement: 'Investissement', retrait: 'Retrait', roi: 'ROI',
}
const typeVariant: Record<TransactionType, 'success' | 'info' | 'error' | 'warning'> = {
  depot: 'success', investissement: 'info', retrait: 'error', roi: 'warning',
}
const typeIcon: Record<TransactionType, React.ReactNode> = {
  depot: <ArrowDownCircle size={16} className="text-green-500" />,
  investissement: <TrendingUp size={16} className="text-blue-500" />,
  retrait: <ArrowUpCircle size={16} className="text-red-500" />,
  roi: <Gift size={16} className="text-amber-500" />,
}
const typeSign: Record<TransactionType, string> = {
  depot: '+', investissement: '-', retrait: '-', roi: '+',
}
const typeColor: Record<TransactionType, string> = {
  depot: 'text-green-600', investissement: 'text-blue-600', retrait: 'text-red-600', roi: 'text-amber-600',
}

const allTransactions = [
  { id: 'txn007', userId: 'u002', type: 'depot' as TransactionType, montant: 500000, status: 'valide' as const, description: 'Dépôt Wave - Traoré Aminata', reference: 'DEP-2024-007001', methodePaiement: 'wave', date: '2024-05-03' },
  { id: 'txn008', userId: 'u003', type: 'investissement' as TransactionType, montant: 250000, status: 'en_attente' as const, description: 'Investissement - Sésame Korhogo', reference: 'INV-2024-007002', campaignId: 'c003', date: '2024-05-02' },
  { id: 'txn009', userId: 'u006', type: 'retrait' as TransactionType, montant: 1000000, status: 'en_attente' as const, description: 'Retrait Orange Money - Coulibaly Ibrahim', reference: 'WIT-2024-007003', methodePaiement: 'orange_money', date: '2024-05-04' },
]

function formatMontant(n: number) { return n.toLocaleString('fr-CI') + ' FCFA' }

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'tous' | TransactionType>('tous')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'valide' | 'en_attente' | 'rejete'>('tous')

  const filtered = allTransactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'tous' || t.type === typeFilter
    const matchStatus = statusFilter === 'tous' || t.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const totalVolume = allTransactions.filter(t => t.status === 'valide').reduce((s, t) => s + t.montant, 0)
  const pending = allTransactions.filter(t => t.status === 'en_attente').length

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Gestion des transactions">
      <div className="space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-gray-800">{allTransactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total transactions</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-green-600">{(totalVolume / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">Volume validé (FCFA)</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-amber-500">{pending}</p>
            <p className="text-xs text-gray-500 mt-1">En attente</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-blue-600">{allTransactions.filter(t => t.type === 'retrait').length}</p>
            <p className="text-xs text-gray-500 mt-1">Retraits</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['tous', 'depot', 'investissement', 'retrait', 'roi'] as const).map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${typeFilter === f ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                {f === 'tous' ? 'Tous' : typeLabel[f]}
              </button>
            ))}
            <div className="w-px bg-gray-200 mx-1" />
            {(['tous', 'valide', 'en_attente', 'rejete'] as const).map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === f ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                {f === 'tous' ? 'Tous statuts' : f === 'valide' ? 'Validé' : f === 'en_attente' ? 'En attente' : 'Rejeté'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-1.5 text-sm w-48" />
            </div>
            <button className="btn-outline px-3 py-1.5 text-xs flex items-center gap-1.5">
              <Download size={13} /> Export
            </button>
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
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Statut</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">Montant</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">{typeIcon[txn.type]}</div>
                        <p className="text-sm font-medium text-gray-800 max-w-48 truncate">{txn.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{txn.reference}</td>
                    <td className="px-5 py-3">
                      <Badge variant={typeVariant[txn.type]} size="sm">{typeLabel[txn.type]}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={txn.status === 'valide' ? 'success' : txn.status === 'en_attente' ? 'warning' : 'error'} size="sm">
                        {txn.status === 'valide' ? 'Validé' : txn.status === 'en_attente' ? 'En attente' : 'Rejeté'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(txn.date).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className={`px-5 py-3 text-right font-bold text-sm ${typeColor[txn.type]}`}>
                      {typeSign[txn.type]}{formatMontant(txn.montant)}
                    </td>
                    <td className="px-5 py-3">
                      {txn.status === 'en_attente' && (
                        <div className="flex gap-1.5">
                          <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                            <CheckCircle size={13} />
                          </button>
                          <button className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                            <XCircle size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}