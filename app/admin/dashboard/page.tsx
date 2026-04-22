import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { ADMIN_NAV } from '@/lib/constants'
import {
  Users, Sprout, Wallet, TrendingUp, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import type { Campaign } from '@/lib/types'

const campaigns: Campaign[] = []
const investments: { montant: number }[] = []
const transactions: { type: string; status: string; montant: number }[] = []

function formatMontant(n: number) {
  return n.toLocaleString('fr-CI') + ' FCFA'
}

const campaignStatusVariant: Record<string, 'info' | 'warning' | 'success' | 'gray'> = {
  draft: 'gray',
  validation: 'warning',
  levee: 'info',
  production: 'success',
  terminee: 'gray',
}

const campaignStatusLabel: Record<string, string> = {
  draft: 'Brouillon',
  validation: 'En validation',
  levee: 'Levée',
  production: 'Production',
  terminee: 'Terminée',
}

const pendingKyc = [
  { id: 'u002', nom: 'Traoré Aminata', email: 'aminata.traore@gmail.com', date: '2024-05-03' },
  { id: 'u003', nom: 'Bamba Sekou', email: 'sekou.bamba@yahoo.fr', date: '2024-05-02' },
  { id: 'u004', nom: 'N\'Guessan Paul', email: 'paul.nguessan@gmail.com', date: '2024-05-01' },
]

const pendingCampaigns = campaigns.filter(c => c.status === 'validation')

export default function AdminDashboardPage() {
  const totalFunds = transactions
    .filter(t => t.type === 'depot' && t.status === 'valide')
    .reduce((s, t) => s + t.montant, 0)

  const totalInvested = investments.reduce((s, i) => s + i.montant, 0)
  const totalROIPaid = transactions
    .filter(t => t.type === 'roi')
    .reduce((s, t) => s + t.montant, 0)

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Administration">
      <div className="space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs actifs', value: '1 247', icon: <Users size={20} />, color: 'blue', sub: '+12 cette semaine' },
            { label: 'Campagnes actives', value: campaigns.filter(c => ['levee', 'production'].includes(c.status)).length.toString(), icon: <Sprout size={20} />, color: 'green', sub: `${pendingCampaigns.length} en validation` },
            { label: 'Fonds collectés', value: `${(totalFunds / 1000000).toFixed(1)}M FCFA`, icon: <Wallet size={20} />, color: 'emerald', sub: 'Total historique' },
            { label: 'ROI distribué', value: `${(totalROIPaid / 1000).toFixed(0)}K FCFA`, icon: <TrendingUp size={20} />, color: 'amber', sub: 'Aux investisseurs' },
          ].map((kpi, i) => (
            <div key={i} className="card p-5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 bg-${kpi.color}-100`}>
                <span className={`text-${kpi.color}-600`}>{kpi.icon}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">{kpi.label}</p>
                <p className="font-bold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* KYC en attente */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-500" />
                KYC en attente
                {pendingKyc.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {pendingKyc.length}
                  </span>
                )}
              </h2>
            </div>
            <div className="space-y-3">
              {pendingKyc.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {user.nom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.nom}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                      <CheckCircle size={14} />
                    </button>
                    <button className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                      <AlertTriangle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campagnes en validation */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 flex items-center gap-2">
                <Sprout size={18} className="text-green-500" />
                Campagnes à valider
                {pendingCampaigns.length > 0 && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {pendingCampaigns.length}
                  </span>
                )}
              </h2>
            </div>
            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Aucune campagne en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCampaigns.map(c => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{c.titre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.cooperativeNom} · {c.region}</p>
                      </div>
                      <Badge variant="warning" size="sm">À valider</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{formatMontant(c.montantCible)}</span>
                      <span>·</span>
                      <span>Score agro : {c.scoreAgronomique}/100</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Approuver
                      </button>
                      <button className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <AlertTriangle size={12} /> Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Toutes les campagnes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800">
              Toutes les campagnes
            </h2>
            <span className="text-xs text-gray-400">{campaigns.length} au total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Campagne</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Coopérative</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Statut</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Levée</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Score</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-48">{c.titre}</p>
                      <p className="text-xs text-gray-400">{c.produit} · {c.region}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.cooperativeNom}</td>
                    <td className="px-4 py-3">
                      <Badge variant={campaignStatusVariant[c.status]} size="sm">
                        {campaignStatusLabel[c.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-medium text-gray-800 text-xs">{formatMontant(c.montantLeve)}</p>
                      <p className="text-xs text-gray-400">
                        {Math.round((c.montantLeve / c.montantCible) * 100)}%
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-sm ${c.scoreAgronomique >= 90 ? 'text-green-600' : c.scoreAgronomique >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                        {c.scoreAgronomique}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/campagnes/${c.slug}`} className="text-green-600 hover:text-green-700">
                        <ArrowUpRight size={15} />
                      </Link>
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