'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { DASHBOARD_NAV } from '@/lib/constants'
import { TrendingUp, Sprout, CheckCircle, Filter, ArrowUpRight } from 'lucide-react'
import { useUser } from '@/lib/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { getInvestmentsByUser } from '@/lib/services/investments'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

const statusLabel: Record<string, string> = {
  actif: 'Actif',
  termine: 'Terminé',
  en_attente: 'En attente',
}

const statusColor: Record<string, 'success' | 'warning' | 'gray'> = {
  actif: 'success',
  termine: 'gray',
  en_attente: 'warning',
}

function formatMontant(n: number) {
  return n.toLocaleString('fr-CI') + ' FCFA'
}

export default function InvestmentsPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  const [investments, setInvestments] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [filtre, setFiltre] = useState<'tous' | 'actif' | 'termine'>('tous')

  useEffect(() => {
    if (userLoading) return
    if (!user) { router.push('/auth/login'); return }

    const supabase = createClient()
    getInvestmentsByUser(supabase, user.id).then(({ data }) => {
      if (data) setInvestments(data as Record<string, unknown>[])
      setDataLoading(false)
    })
  }, [user, userLoading, router])

  if (userLoading || dataLoading) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Mes Investissements">
        <PageLoader />
      </DashboardLayout>
    )
  }

  const filtered = investments.filter(inv =>
    filtre === 'tous' ? true : inv.status === filtre
  )

  const totalInvesti = investments.reduce((s, i) => s + ((i.montant as number) ?? 0), 0)
  const totalActif = investments.filter(i => i.status === 'actif').reduce((s, i) => s + ((i.montant as number) ?? 0), 0)
  const totalROI = investments
    .filter(i => i.roi_actual)
    .reduce((s, i) => s + ((i.montant as number) ?? 0) * (((i.roi_actual as number) ?? 0) / 100), 0)

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Mes Investissements">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total investi</p>
              <p className="font-bold text-gray-800">{formatMontant(totalInvesti)}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Sprout className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Actifs en cours</p>
              <p className="font-bold text-gray-800">{formatMontant(totalActif)}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <CheckCircle className="text-yellow-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">ROI encaissé</p>
              <p className="font-bold text-gray-800">{formatMontant(totalROI)}</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {(['tous', 'actif', 'termine'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filtre === f
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {f === 'tous' ? 'Tous' : f === 'actif' ? 'Actifs' : 'Terminés'}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filtered.map(inv => {
            const camp = inv.campaigns as Record<string, unknown> | null
            const montantLeve = (camp?.montant_leve as number) ?? 0
            const montantCible = (camp?.montant_cible as number) ?? 1
            const progress = Math.round((montantLeve / montantCible) * 100)

            return (
              <div key={inv.id as string} className="card p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {camp && (camp.image as string | undefined) && (
                    <img
                      src={camp.image as string}
                      alt={(camp.titre as string) ?? ''}
                      className="w-full md:w-24 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                          {(camp?.titre as string) ?? '—'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{(camp?.produit as string) ?? ''}</p>
                      </div>
                      <Badge variant={statusColor[inv.status as string] ?? 'gray'}>
                        {statusLabel[inv.status as string] ?? inv.status as string}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Investi</p>
                        <p className="font-semibold text-gray-800">{formatMontant((inv.montant as number) ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">ROI attendu</p>
                        <p className="font-semibold text-green-600">{(inv.roi_expected as number) ?? 0}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">
                          {inv.status === 'termine' ? 'ROI réel' : 'Retour prévu'}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {inv.status === 'termine' && inv.roi_actual
                            ? `${inv.roi_actual}%`
                            : inv.date_retour_prev
                              ? new Date(inv.date_retour_prev as string).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })
                              : '—'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="font-semibold text-gray-800">
                          {inv.date_investissement
                            ? new Date(inv.date_investissement as string).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })
                            : new Date(inv.created_at as string).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short', year: 'numeric' })
                          }
                        </p>
                      </div>
                    </div>

                    {inv.status === 'actif' && camp && (
                      <div className="mt-3">
                        <ProgressBar value={progress} max={100} />
                        <p className="text-xs text-gray-400 mt-1">Levée : {progress}%</p>
                      </div>
                    )}
                  </div>

                  {camp && (camp.slug as string | undefined) && (
                    <Link
                      href={`/campagnes/${camp.slug as string}`}
                      className="flex-shrink-0 flex items-center gap-1 text-green-600 text-sm font-medium hover:underline"
                    >
                      Voir <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <EmptyState
              icon={<Sprout size={40} />}
              title="Aucun investissement"
              description="Vous n'avez pas encore investi dans cette catégorie."
              action={{ label: 'Découvrir les campagnes', href: '/campagnes' }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
