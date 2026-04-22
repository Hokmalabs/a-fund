'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { ADMIN_NAV } from '@/lib/constants'
import Image from 'next/image'
import { Search, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Campaign, CampaignStatus } from '@/lib/types'

const campaigns: Campaign[] = []

const statusVariant: Record<CampaignStatus, 'gray' | 'warning' | 'info' | 'success'> = {
  draft: 'gray', validation: 'warning', levee: 'info', production: 'success', terminee: 'gray',
}
const statusLabel: Record<CampaignStatus, string> = {
  draft: 'Brouillon', validation: 'Validation', levee: 'Levée', production: 'Production', terminee: 'Terminée',
}
const risqueVariant: Record<string, 'success' | 'warning' | 'error'> = {
  faible: 'success', modere: 'warning', eleve: 'error',
}

function formatMontant(n: number) {
  return (n / 1000000).toFixed(1) + 'M FCFA'
}

export default function AdminCampaignsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | CampaignStatus>('tous')

  const filtered = campaigns.filter(c => {
    const matchSearch = c.titre.toLowerCase().includes(search.toLowerCase()) ||
      c.cooperativeNom.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'tous' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Gestion des campagnes">
      <div className="space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {(['tous', 'validation', 'levee', 'production', 'terminee'] as const).map(s => {
            const count = s === 'tous' ? campaigns.length : campaigns.filter(c => c.status === s).length
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`card p-3 text-center transition-all ${statusFilter === s ? 'ring-2 ring-green-500' : ''}`}>
                <p className="text-xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s === 'tous' ? 'Total' : statusLabel[s]}</p>
              </button>
            )
          })}
        </div>

        {/* Recherche */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une campagne..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm w-full"
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Campagne</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Coopérative</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Statut</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Risque</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Cible</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Levé</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Score</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const progress = Math.round((c.montantLeve / c.montantCible) * 100)
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image src={c.image || '/placeholder.jpg'} alt={c.titre} width={40} height={40} className="rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800 max-w-40 truncate">{c.titre}</p>
                            <p className="text-xs text-gray-400">{c.produit} · {c.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-32 truncate">{c.cooperativeNom}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[c.status]} size="sm">{statusLabel[c.status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={risqueVariant[c.risque]} size="sm">{c.risque}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-medium text-gray-700">{formatMontant(c.montantCible)}</td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-xs font-medium text-green-600">{formatMontant(c.montantLeve)}</p>
                        <p className="text-xs text-gray-400">{progress}%</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold text-sm ${c.scoreAgronomique >= 90 ? 'text-green-600' : c.scoreAgronomique >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                          {c.scoreAgronomique}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {c.status === 'validation' && (
                            <>
                              <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Approuver">
                                <CheckCircle size={13} />
                              </button>
                              <button className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Rejeter">
                                <XCircle size={13} />
                              </button>
                            </>
                          )}
                          <Link href={`/campagnes/${c.slug}`} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
                            <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}