'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Users, Clock, Shield, Award, TrendingUp,
  CheckCircle, ArrowRight, ChevronLeft, Scale, Sprout, Building
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CampaignCard from '@/components/campaign/CampaignCard'
import CampaignMap from '@/components/campaign/CampaignMap'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import { createClient } from '@/lib/supabase/client'
import { getCampaignBySlug, getCampaigns } from '@/lib/services/campaigns'
import {
  formatCurrency, formatCurrencyFull, formatDate,
  calculateProgress, calculateDaysLeft, getRiskLabel, getRiskColor
} from '@/lib/utils'
import type { Campaign } from '@/lib/types'

const QUICK_AMOUNTS = [10000, 50000, 100000, 250000]

function toAppCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    titre: row.titre as string,
    slug: row.slug as string,
    description: (row.description as string) ?? '',
    descriptionCourte: (row.description_courte as string) ?? '',
    produit: (row.produit as string) ?? '',
    variete: (row.variete as string) ?? '',
    region: (row.region as string) ?? '',
    ville: (row.ville as string) ?? '',
    lat: row.lat as number | undefined,
    lng: row.lng as number | undefined,
    cooperativeId: (row.cooperative_id as string) ?? '',
    cooperativeNom: (row.cooperative_nom as string) ?? '',
    cooperativeMembers: (row.cooperative_members as number) ?? 0,
    surface: (row.surface as number) ?? 0,
    rendementAttendu: (row.rendement_attendu as number) ?? 0,
    montantCible: (row.montant_cible as number) ?? 0,
    montantLeve: (row.montant_leve as number) ?? 0,
    nombreInvestisseurs: (row.nombre_investisseurs as number) ?? 0,
    roiMin: (row.roi_min as number) ?? 0,
    roiMax: (row.roi_max as number) ?? 0,
    dureeJours: (row.duree_jours as number) ?? 0,
    dateDebut: (row.date_debut as string) ?? '',
    dateFin: (row.date_fin as string) ?? '',
    dateRecolte: (row.date_recolte as string) ?? '',
    status: row.status as Campaign['status'],
    risque: row.risque as Campaign['risque'],
    image: (row.image as string) ?? '',
    images: [(row.image as string) ?? ''],
    acheteur: (row.acheteur as string) ?? '',
    prixGarantiKg: (row.prix_garanti_kg as number) ?? 0,
    quantiteContratTonnes: (row.quantite_contrat_tonnes as number) ?? 0,
    agronome: (row.agronome as string) ?? '',
    scoreAgronomique: (row.score_agronomique as number) ?? 0,
    assurance: (row.assurance as boolean) ?? false,
    tags: (row.tags as string[]) ?? [],
    createdAt: (row.created_at as string) ?? '',
  }
}

export default function CampaignDetailPage() {
  const params = useParams()
  const slug = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [similar, setSimilar] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound404, setNotFound404] = useState(false)

  const [montant, setMontant] = useState(50000)
  const [assurance, setAssurance] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      getCampaignBySlug(supabase, slug),
      getCampaigns(supabase),
    ]).then(([{ data: campData }, { data: allData }]) => {
      if (!campData) { setNotFound404(true); setLoading(false); return }
      const mapped = toAppCampaign(campData)
      setCampaign(mapped)
      if (allData) {
        setSimilar(
          allData
            .filter(c => c.id !== campData.id && (c.produit === campData.produit || c.region === campData.region))
            .slice(0, 3)
            .map(toAppCampaign)
        )
      }
      setLoading(false)
    })
  }, [slug])

  if (notFound404) notFound()

  if (loading || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  const progress = calculateProgress(campaign.montantLeve, campaign.montantCible)
  const daysLeft = calculateDaysLeft(campaign.dateFin)
  const statusVariant = campaign.status === 'levee' ? 'success' : campaign.status === 'production' ? 'info' : 'gray'
  const statusLabel = campaign.status === 'levee' ? 'En levée' : campaign.status === 'production' ? 'En production' : 'Terminée'
  const prixDynamiqueMultiplier = 1 + (progress / 100) * 0.2
  const roiActuel = campaign.roiMin + ((campaign.roiMax - campaign.roiMin) * progress / 100)
  const actions = Math.floor(montant / 2273)
  const roi = Math.round(montant * roiActuel / 100)
  const assuranceCout = assurance ? Math.round(montant * 0.03) : 0
  const retourNet = montant + roi - assuranceCout

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Accueil</Link>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <Link href="/campagnes" className="hover:text-primary-600">Campagnes</Link>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-gray-800 font-medium truncate max-w-xs">{campaign.titre}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Image */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
              <Image src={campaign.image} alt={campaign.titre} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={statusVariant}>{statusLabel}</Badge>
                {campaign.assurance && <Badge variant="primary">🛡️ Assuré</Badge>}
              </div>
            </div>

            {/* Title Card */}
            <div className="card p-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />{campaign.ville}, {campaign.region}
                </span>
                <span className="font-semibold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-full">
                  {campaign.produit}
                </span>
                <span className={'text-xs font-semibold px-2 py-1 rounded-full ' + getRiskColor(campaign.risque)}>
                  {getRiskLabel(campaign.risque)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {campaign.titre}
              </h1>
              <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'ROI visé', value: campaign.roiMin + '-' + campaign.roiMax + '%', icon: TrendingUp, color: 'text-primary-600 bg-primary-50' },
                { label: 'Durée', value: campaign.dureeJours + ' jours', icon: Clock, color: 'text-blue-600 bg-blue-50' },
                { label: 'Surface', value: campaign.surface + ' ha', icon: Sprout, color: 'text-green-600 bg-green-50' },
                { label: 'Rendement', value: campaign.rendementAttendu + ' t', icon: Award, color: 'text-secondary-600 bg-secondary-50' },
              ].map(s => (
                <div key={s.label} className="card p-4 text-center">
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ' + s.color}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Cooperative */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Building className="w-5 h-5 text-primary-500" /> La coopérative
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{campaign.cooperativeNom}</p>
                  <p className="text-sm text-gray-500">{campaign.cooperativeMembers} membres · {campaign.ville}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-primary-500" />
                    <span className="text-xs text-primary-600 font-medium">Coopérative certifiée A-FUND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte géolocalisation */}
            {campaign.lat && campaign.lng && (
              <div className="card p-6">
                <CampaignMap
                  lat={campaign.lat}
                  lng={campaign.lng}
                  titre={campaign.titre}
                  ville={campaign.ville}
                  surface={campaign.surface}
                />
              </div>
            )}

            {/* Purchase Contract */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Scale className="w-5 h-5 text-blue-500" /> Contrat d&apos;achat
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Acheteur', value: campaign.acheteur },
                  { label: 'Prix garanti', value: formatCurrencyFull(campaign.prixGarantiKg) + '/kg' },
                  { label: 'Quantité contractée', value: campaign.quantiteContratTonnes + ' tonnes' },
                ].map(item => (
                  <div key={item.label} className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">{item.label}</p>
                    <p className="font-bold text-blue-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agronomic Report */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Award className="w-5 h-5 text-green-500" /> Rapport agronomique
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{campaign.agronome}</p>
                  <p className="text-sm text-gray-500">Agronome certifié A-FUND</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{campaign.scoreAgronomique}</p>
                  <p className="text-xs text-gray-500">/100</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Score de viabilité</span>
                  <span className="text-sm font-bold text-green-800">{campaign.scoreAgronomique}/100</span>
                </div>
                <ProgressBar value={campaign.scoreAgronomique} color="success" />
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="card p-6">
                {!confirmed ? (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                      Investir dans cette campagne
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Minimum : 10 000 FCFA</p>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-primary-600">{formatCurrency(campaign.montantLeve)}</span>
                        <span className="text-gray-400 text-sm">sur {formatCurrency(campaign.montantCible)}</span>
                      </div>
                      <ProgressBar value={progress} />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{progress.toFixed(0)}% financé</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{campaign.nombreInvestisseurs}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{daysLeft > 0 ? daysLeft + ' j.' : 'Terminé'}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-amber-800">Prix dynamique — avancement campagne</p>
                        <span className="text-xs font-bold text-amber-700">{progress.toFixed(0)}% avancé</span>
                      </div>
                      <ProgressBar value={progress} color="warning" />
                      <p className="text-xs text-amber-700 mt-2">
                        Prix actuel : ×{prixDynamiqueMultiplier.toFixed(3)} du prix initial · 🌿
                      </p>
                      <p className="text-xs text-amber-600">
                        {campaign.risque === 'faible' ? 'Culture établie — risque faible' : campaign.risque === 'modere' ? 'Culture établie — risque moyen' : 'Risque élevé'}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Montant à investir (FCFA)</label>
                      <input
                        type="number"
                        value={montant}
                        onChange={e => setMontant(Math.max(10000, Number(e.target.value)))}
                        className="input-field w-full text-lg font-bold py-3"
                        step={10000}
                        min={10000}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {QUICK_AMOUNTS.map(a => (
                        <button
                          key={a}
                          onClick={() => setMontant(a)}
                          className={`text-xs py-2 rounded-xl border font-semibold transition-all ${
                            montant === a
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                          }`}
                        >
                          {a >= 1000 ? (a / 1000) + 'k' : a}
                        </button>
                      ))}
                    </div>

                    {campaign.assurance && (
                      <div
                        onClick={() => setAssurance(!assurance)}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer mb-4 transition-all ${
                          assurance ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          assurance ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {assurance && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <p className="text-sm font-semibold text-gray-800">Assurer mon investissement</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Protection CNAAS contre les aléas climatiques · Coût : 3% du montant investi
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 rounded-xl p-4 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capital investi</span>
                        <span className="font-bold text-gray-800">{formatCurrencyFull(montant)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Actions obtenues</span>
                        <span className="font-bold text-gray-800">{actions} actions</span>
                      </div>
                      {assurance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Assurance (3%)</span>
                          <span className="font-bold text-red-500">-{formatCurrencyFull(assuranceCout)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROI actuel ({roiActuel.toFixed(1)}%)</span>
                        <span className="font-bold text-green-600">+{formatCurrencyFull(roi)}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 flex justify-between">
                        <span className="font-bold text-gray-800">Retour net estimé</span>
                        <span className="font-bold text-green-700 text-lg">{formatCurrencyFull(retourNet)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmed(true)}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                      Confirmer l&apos;investissement <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">Paiement via Orange Money, MTN, Wave</p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-gray-800 mb-2">
                      Investissement simulé !
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Dans la version finale, votre paiement Mobile Money serait traité ici.
                    </p>
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                      <p className="text-2xl font-bold text-green-700">{formatCurrencyFull(montant)}</p>
                      <p className="text-sm text-green-600">investis dans {campaign.titre}</p>
                      <p className="text-xs text-gray-500 mt-1">ROI attendu : +{formatCurrencyFull(roi)}</p>
                    </div>
                    <Link href="/dashboard" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
                      Voir mon portfolio →
                    </Link>
                    <button onClick={() => setConfirmed(false)} className="text-xs text-gray-400 hover:text-gray-600">
                      Recommencer
                    </button>
                  </div>
                )}

                {!confirmed && (
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                    {[
                      "Contrat d'achat garanti",
                      'Validation agronomique',
                      campaign.assurance ? 'Assurance récolte disponible' : 'Rendement certifié',
                    ].map(g => (
                      <div key={g} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!confirmed && (
                <div className="card p-5">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Calendrier</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Début levée', date: campaign.dateDebut },
                      { label: 'Fin levée', date: campaign.dateFin },
                      { label: 'Récolte prévue', date: campaign.dateRecolte },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-800">{formatDate(item.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Campaigns */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Campagnes similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
