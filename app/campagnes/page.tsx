'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CampaignCard from '@/components/campaign/CampaignCard'
import { createClient } from '@/lib/supabase/client'
import { getCampaigns } from '@/lib/services/campaigns'
import { PRODUITS, REGIONS_CI } from '@/lib/constants'
import type { Campaign } from '@/lib/types'

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'levee', label: 'En levée' },
  { value: 'production', label: 'En production' },
  { value: 'terminee', label: 'Terminées' },
]

const sortOptions = [
  { value: 'recent', label: 'Plus récentes' },
  { value: 'roi', label: 'ROI le plus élevé' },
  { value: 'progress', label: 'Presque financées' },
]

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

export default function CampagnesPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [produitFilter, setProduitFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    getCampaigns(supabase).then(({ data }) => {
      if (data) setCampaigns(data.map(toAppCampaign))
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let result = [...campaigns]
    if (search) {
      result = result.filter(c =>
        c.titre.toLowerCase().includes(search.toLowerCase()) ||
        c.produit.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) result = result.filter(c => c.status === statusFilter)
    if (produitFilter) result = result.filter(c => c.produit === produitFilter)
    if (regionFilter) result = result.filter(c => c.region === regionFilter)
    result.sort((a, b) => {
      if (sortBy === 'roi') return b.roiMax - a.roiMax
      if (sortBy === 'progress') return (b.montantLeve / b.montantCible) - (a.montantLeve / a.montantCible)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return result
  }, [campaigns, search, statusFilter, produitFilter, regionFilter, sortBy])

  const activeFilters = [statusFilter, produitFilter, regionFilter].filter(Boolean).length

  const clearFilters = () => {
    setStatusFilter('')
    setProduitFilter('')
    setRegionFilter('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Marketplace des campagnes
          </h1>
          <p className="text-gray-500">
            {loading ? 'Chargement...' : `${campaigns.length} projets agricoles certifiés disponibles`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par produit, région..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto min-w-[180px]"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={
              'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ' +
              (showFilters
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300')
            }
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFilters > 0 && (
              <span className="bg-white/30 text-xs px-1.5 py-0.5 rounded-full font-bold">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field">
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Produit</label>
              <select value={produitFilter} onChange={(e) => setProduitFilter(e.target.value)} className="input-field">
                <option value="">Tous les produits</option>
                {PRODUITS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Région</label>
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="input-field">
                <option value="">Toutes les régions</option>
                {REGIONS_CI.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {activeFilters > 0 && (
              <div className="sm:col-span-3 flex justify-end">
                <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium">
                  <X className="w-4 h-4" /> Effacer les filtres
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
            campagne{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Aucune campagne trouvée
            </h3>
            <p className="text-gray-400 mb-6">Essayez de modifier vos filtres de recherche</p>
            <button onClick={clearFilters} className="btn-primary text-sm">Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
