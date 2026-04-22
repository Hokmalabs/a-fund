'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight, TrendingUp, Users, Shield, Sprout,
  CheckCircle, Star, ChevronRight, Wallet, FileText, Award
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CampaignCard from '@/components/campaign/CampaignCard'
import { createClient } from '@/lib/supabase/client'
import { getCampaigns } from '@/lib/services/campaigns'
import { formatCurrency } from '@/lib/utils'
import { STATS_GLOBALES } from '@/lib/constants'
import type { Campaign } from '@/lib/types'

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
    status: (row.status as Campaign['status']) ?? 'draft',
    risque: (row.risque as Campaign['risque']) ?? 'modere',
    scoreAgronomique: (row.score_agronomique as number) ?? 0,
    image: (row.image as string) ?? '',
    images: [(row.image as string) ?? ''],
    acheteur: (row.acheteur as string) ?? '',
    prixGarantiKg: (row.prix_garanti_kg as number) ?? 0,
    quantiteContratTonnes: (row.quantite_contrat_tonnes as number) ?? 0,
    agronome: (row.agronome as string) ?? '',
    assurance: !!(row.assurance),
    tags: (row.tags as string[]) ?? [],
    createdAt: (row.created_at as string) ?? '',
  }
}

const testimonials = [
  {
    nom: 'Koffi André',
    ville: 'Abidjan',
    roi: '21%',
    text: "J'investis sur A-FUND depuis 8 mois. Mes retours dépassent mes attentes. La transparence est totale : je vois chaque étape de la production.",
    avatar: 'KA',
  },
  {
    nom: 'Fatoumata Diallo',
    ville: 'Bouaké',
    roi: '19%',
    text: "Enfin une plateforme qui connecte vraiment les investisseurs urbains avec les producteurs ruraux. Je suis fière de soutenir l'agriculture ivoirienne.",
    avatar: 'FD',
  },
  {
    nom: 'Moussa Coulibaly',
    ville: 'Korhogo',
    roi: '24%',
    text: "La certification agronomique et les contrats d'achat pré-signés me donnent la confiance nécessaire pour investir des montants importants.",
    avatar: 'MC',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Créez votre compte',
    desc: "Inscrivez-vous gratuitement et complétez votre vérification KYC en 5 minutes depuis votre téléphone.",
    icon: Users,
  },
  {
    step: '02',
    title: 'Choisissez une campagne',
    desc: "Parcourez les campagnes certifiées, consultez les rapports agronomiques et les contrats d'achat garantis.",
    icon: FileText,
  },
  {
    step: '03',
    title: 'Investissez',
    desc: "Investissez dès 5 000 FCFA via Orange Money, MTN Money, Wave ou carte bancaire. Immédiatement confirmé.",
    icon: Wallet,
  },
  {
    step: '04',
    title: 'Recevez vos revenus',
    desc: "À la récolte, recevez votre capital + ROI directement dans votre wallet en 24h. Retrait instantané.",
    icon: TrendingUp,
  },
]

const features = [
  {
    icon: Award,
    title: 'Certification triple',
    desc: 'Chaque projet est validé par un agronome certifié, un juriste et notre équipe.',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: Shield,
    title: "Contrats d'achat garantis",
    desc: "Toutes nos campagnes disposent d'un contrat d'achat pré-signé avec un acheteur vérifié.",
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: CheckCircle,
    title: 'Traçabilité totale',
    desc: "Photos, vidéos et rapports hebdomadaires tout au long de la campagne de production.",
    color: 'text-secondary-600 bg-secondary-50',
  },
  {
    icon: Sprout,
    title: 'Impact réel',
    desc: "Chaque FCFA investi améliore les conditions de vie des agriculteurs et de leurs familles.",
    color: 'text-green-600 bg-green-50',
  },
]

export default function HomePage() {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    const supabase = createClient()
    getCampaigns(supabase).then(({ data }) => {
      if (data) setAllCampaigns(data.map(toAppCampaign))
    })
  }, [])

  const featuredCampaigns = allCampaigns.filter((c: Campaign) => c.status === 'levee').slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 opacity-90" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-primary-400 rounded-full" />
                <span className="text-primary-300 text-sm font-medium">
                  {allCampaigns.filter((c: Campaign) => c.status === 'levee').length} campagnes en levée de fonds
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Investissez dans{' '}
                <span className="text-primary-400">l&apos;agriculture</span>{' '}
                africaine
              </h1>

              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Financez des coopératives agricoles en Côte d&apos;Ivoire.
                Dès <strong className="text-white">5 000 FCFA</strong>, obtenez des rendements de{' '}
                <strong className="text-primary-400">15-25%</strong> en 90-120 jours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/campagnes" className="btn-primary flex items-center justify-center gap-2 text-base">
                  Voir les campagnes <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
                >
                  Comment ça marche
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['JK', 'AT', 'SO', 'MB'].map((init) => (
                    <div
                      key={init}
                      className="w-8 h-8 rounded-full bg-primary-500 border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Rejoignez{' '}
                  <strong className="text-white">
                    {STATS_GLOBALES.nombreInvestisseurs.toLocaleString()}
                  </strong>{' '}
                  investisseurs actifs
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-semibold mb-6 text-center">Impact depuis le lancement</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total investi', value: formatCurrency(STATS_GLOBALES.totalInvesti), icon: Wallet },
                    { label: 'Investisseurs', value: STATS_GLOBALES.nombreInvestisseurs.toLocaleString(), icon: Users },
                    { label: 'ROI moyen', value: STATS_GLOBALES.roiMoyen + '%', icon: TrendingUp },
                    { label: 'Taux de succès', value: STATS_GLOBALES.tauxSucces + '%', icon: CheckCircle },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">
                      97.4% des campagnes ont atteint leurs objectifs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: formatCurrency(STATS_GLOBALES.totalInvesti), label: 'Investis au total' },
              { value: STATS_GLOBALES.cooperativesPartenaires + '+', label: 'Coopératives partenaires' },
              { value: STATS_GLOBALES.tauxSucces + '%', label: 'Taux de succès' },
              { value: STATS_GLOBALES.paysCouverts + ' pays', label: 'Marchés couverts' },
            ].map((s) => (
              <div key={s.label} className="py-2">
                <p className="text-2xl font-bold text-primary-600" style={{ fontFamily: 'Georgia, serif' }}>
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Opportunités</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
              Campagnes en cours
            </h2>
            <p className="text-gray-500 mt-2">Investissez maintenant dans ces projets certifiés</p>
          </div>
          <Link
            href="/campagnes"
            className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/campagnes" className="btn-outline inline-flex items-center gap-2">
            Explorer toutes les campagnes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Simple & rapide</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Commencez à investir en moins de 10 minutes depuis votre téléphone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              Commencer maintenant — c&apos;est gratuit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Notre approche</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            Pourquoi choisir A-FUND ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className={'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ' + feature.color}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-300 text-sm font-semibold uppercase tracking-wider">Témoignages</span>
            <h2 className="text-3xl font-bold text-white mt-2" style={{ fontFamily: 'Georgia, serif' }}>
              Ce que disent nos investisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.nom} className="bg-white/10 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary-400 text-secondary-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.nom}</p>
                      <p className="text-gray-400 text-xs">{t.ville}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-400 font-bold text-sm">{t.roi}</p>
                    <p className="text-gray-500 text-xs">ROI obtenu</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Prêt à investir dans l&apos;avenir de l&apos;agriculture ?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez {STATS_GLOBALES.nombreInvestisseurs.toLocaleString()} investisseurs et générez
            des revenus tout en transformant l&apos;agriculture africaine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Créer mon compte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/campagnes"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all duration-200 inline-flex items-center gap-2"
            >
              Voir les campagnes
            </Link>
          </div>
          <p className="text-primary-200 text-sm mt-6">
            Gratuit · Pas de frais cachés · Retraits instantanés
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}