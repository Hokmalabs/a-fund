'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { COOPERATIVE_NAV } from '@/lib/constants'
import { Users, TrendingUp, Search, MessageCircle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const mockInvestors = [
  { id: 'u001', nom: 'Kouamé Jean-Baptiste', email: 'jb.kouame@gmail.com', ville: 'Abidjan', montantTotal: 3500000, nombreInvestissements: 2, roiMoyen: 19, datePremiereInv: '2024-01-20', status: 'actif' },
  { id: 'u009', nom: 'Assi Bénédicte', email: 'bene.assi@gmail.com', ville: 'Bouaké', montantTotal: 1000000, nombreInvestissements: 1, roiMoyen: 22, datePremiereInv: '2024-03-05', status: 'actif' },
  { id: 'u010', nom: 'Ouattara Karim', email: 'karim.ouatt@yahoo.fr', ville: 'Abidjan', montantTotal: 2500000, nombreInvestissements: 1, roiMoyen: 20, datePremiereInv: '2024-02-15', status: 'actif' },
  { id: 'u011', nom: 'Konaté Salimata', email: 'salimata.k@gmail.com', ville: 'Daloa', montantTotal: 500000, nombreInvestissements: 1, roiMoyen: 18, datePremiereInv: '2024-03-10', status: 'actif' },
  { id: 'u012', nom: 'Yébouet Franck', email: 'franck.yebo@gmail.com', ville: 'Abidjan', montantTotal: 750000, nombreInvestissements: 1, roiMoyen: 22, datePremiereInv: '2024-03-08', status: 'termine' },
]

function formatMontant(n: number) {
  return n.toLocaleString('fr-CI') + ' FCFA'
}

export default function CoopInvestorsPage() {
  const [search, setSearch] = useState('')

  const filtered = mockInvestors.filter(inv =>
    inv.nom.toLowerCase().includes(search.toLowerCase()) ||
    inv.email.toLowerCase().includes(search.toLowerCase()) ||
    inv.ville.toLowerCase().includes(search.toLowerCase())
  )

  const totalInvesti = mockInvestors.reduce((s, i) => s + i.montantTotal, 0)
  const totalInvestisseurs = mockInvestors.length
  const roiMoyenGlobal = Math.round(mockInvestors.reduce((s, i) => s + i.roiMoyen, 0) / mockInvestors.length)

  return (
    <DashboardLayout navItems={COOPERATIVE_NAV} title="Mes investisseurs">
      <div className="space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Investisseurs</p>
              <p className="font-bold text-gray-800 text-lg">{totalInvestisseurs}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total collecté</p>
              <p className="font-bold text-gray-800">{(totalInvesti / 1000000).toFixed(1)}M FCFA</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <TrendingUp className="text-amber-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">ROI moyen servi</p>
              <p className="font-bold text-gray-800 text-lg">{roiMoyenGlobal}%</p>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un investisseur..."
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
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Investisseur</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Ville</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-medium">Montant investi</th>
                  <th className="text-center px-5 py-3 text-gray-500 font-medium">Investissements</th>
                  <th className="text-center px-5 py-3 text-gray-500 font-medium">ROI moyen</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">1er invest.</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Statut</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {inv.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{inv.nom}</p>
                          <p className="text-xs text-gray-400">{inv.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{inv.ville}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-800 text-xs">
                      {formatMontant(inv.montantTotal)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {inv.nombreInvestissements}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center font-bold text-green-600 text-sm">
                      {inv.roiMoyen}%
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(inv.datePremiereInv).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={inv.status === 'actif' ? 'success' : 'gray'} size="sm">
                        {inv.status === 'actif' ? 'Actif' : 'Terminé'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href="/cooperative/messages"
                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors inline-flex"
                        title="Envoyer un message"
                      >
                        <MessageCircle size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-gray-400 text-sm">
                <Users size={28} className="mx-auto mb-2 opacity-30" />
                Aucun investisseur trouvé
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}