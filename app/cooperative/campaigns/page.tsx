import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { COOPERATIVE_NAV } from '@/lib/constants'
import { Sprout, ArrowUpRight, Plus, Users, TrendingUp } from 'lucide-react'
import type { Campaign } from '@/lib/types'

const campaigns: Campaign[] = []
import Link from 'next/link'

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

export default function CoopCampaignsPage() {
  return (
    <DashboardLayout navItems={COOPERATIVE_NAV} title="Mes Campagnes">
      <div className="space-y-6">

        {/* Header action */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{campaigns.length} campagne(s) au total</p>
          <Link href="/cooperative/campaigns/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Nouvelle campagne
          </Link>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {campaigns.map(campaign => {
            const progress = Math.round((campaign.montantLeve / campaign.montantCible) * 100)
            const roiMoyen = ((campaign.roiMin + campaign.roiMax) / 2).toFixed(0)

            return (
              <div key={campaign.id} className="card p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={campaign.image}
                    alt={campaign.titre}
                    className="w-full md:w-32 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{campaign.titre}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{campaign.region} · {campaign.surface} ha</p>
                      </div>
                      <Badge variant={statusVariant[campaign.status]} size="sm">
                        {statusLabel[campaign.status]}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Montant cible</p>
                        <p className="font-semibold text-gray-800">{formatMontant(campaign.montantCible)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Levé</p>
                        <p className="font-semibold text-green-600">{formatMontant(campaign.montantLeve)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Users size={10} /> Investisseurs</p>
                        <p className="font-semibold text-gray-800">{campaign.nombreInvestisseurs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={10} /> ROI moyen</p>
                        <p className="font-semibold text-gray-800">{roiMoyen}%</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progression levée</span>
                        <span>{Math.min(progress, 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:justify-start flex-shrink-0">
                    <Link
                      href={`/campagnes/${campaign.slug}`}
                      className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      Voir <ArrowUpRight size={12} />
                    </Link>
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </DashboardLayout>
  )
}