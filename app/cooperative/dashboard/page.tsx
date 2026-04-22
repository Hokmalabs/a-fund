import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from '@/components/ui/StatsCard'
import Badge from '@/components/ui/Badge'
import { COOPERATIVE_NAV } from '@/lib/constants'
import { TrendingUp, Users, Sprout, Wallet, ArrowUpRight, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Campaign } from '@/lib/types'

const campaigns: Campaign[] = []
const investments: { montant: number; roi_expected?: number }[] = []
const transactions: { type: string; montant: number }[] = []
const myCampaigns = campaigns.slice(0, 3)

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'gray'> = {
  draft: 'gray',
  validation: 'warning',
  levee: 'info',
  production: 'success',
  terminee: 'gray',
}

const statusLabel: Record<string, string> = {
  draft: 'Brouillon',
  validation: 'En validation',
  levee: 'Levée en cours',
  production: 'En production',
  terminee: 'Terminée',
}

function formatMontant(n: number) {
  return n.toLocaleString('fr-CI') + ' FCFA'
}

export default function CoopDashboardPage() {
  const totalLeve = myCampaigns.reduce((s, c) => s + c.montantLeve, 0)
  const totalInvestisseurs = myCampaigns.reduce((s, c) => s + c.nombreInvestisseurs, 0)
  const totalCampagnes = myCampaigns.length
  const enProduction = myCampaigns.filter(c => c.status === 'production').length

  return (
    <DashboardLayout navItems={COOPERATIVE_NAV} title="Tableau de bord Coopérative">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Wallet className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total levé</p>
              <p className="font-bold text-gray-800 text-sm">{formatMontant(totalLeve)}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Investisseurs</p>
              <p className="font-bold text-gray-800 text-sm">{totalInvestisseurs}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Sprout className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Campagnes</p>
              <p className="font-bold text-gray-800 text-sm">{totalCampagnes} total</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <TrendingUp className="text-amber-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">En production</p>
              <p className="font-bold text-gray-800 text-sm">{enProduction} campagne(s)</p>
            </div>
          </div>
        </div>

        {/* Campagnes récentes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 text-lg">
              Mes campagnes
            </h2>
            <Link href="/cooperative/campaigns" className="text-sm text-green-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {myCampaigns.map(campaign => {
              const progress = Math.round((campaign.montantLeve / campaign.montantCible) * 100)
              return (
                <div key={campaign.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={campaign.image}
                    alt={campaign.titre}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">{campaign.titre}</p>
                      <Badge variant={statusVariant[campaign.status]} size="sm">
                        {statusLabel[campaign.status]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatMontant(campaign.montantLeve)} levés</span>
                      <span>·</span>
                      <span>{campaign.nombreInvestisseurs} investisseurs</span>
                      <span>·</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/campagnes/${campaign.slug}`}
                    className="flex-shrink-0 text-green-600 hover:text-green-700"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )
            })}
          </div>

          <Link href="/cooperative/campaigns/new" className="btn-primary w-full mt-5 flex items-center justify-center gap-2 text-sm">
            <Sprout size={15} /> Créer une nouvelle campagne
          </Link>
        </div>

        {/* Prochaines échéances */}
        <div className="card p-6">
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 text-lg mb-4">
            Prochaines échéances
          </h2>
          <div className="space-y-3">
            {myCampaigns.filter(c => c.status !== 'terminee').map(c => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <Clock size={15} className="text-amber-500 flex-shrink-0" />
                <span className="text-gray-600 flex-1 truncate">{c.titre}</span>
                <span className="text-gray-500 text-xs flex-shrink-0">
                  Récolte : {new Date(c.dateRecolte).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}