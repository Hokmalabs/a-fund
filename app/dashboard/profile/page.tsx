'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { useProfile } from '@/lib/hooks/useProfile'
import { DASHBOARD_NAV } from '@/lib/constants'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ProfilePage() {
  const { profile, loading } = useProfile()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        prenom: profile.prenom ?? '',
        nom: profile.nom ?? '',
        email: profile.email ?? '',
        telephone: profile.telephone ?? '',
        ville: profile.ville ?? '',
      })
    }
  }, [profile])

  const kycVariant = {
    verifie: 'success',
    en_attente: 'warning',
    non_soumis: 'gray',
    rejete: 'error',
  } as const

  const kycLabel = {
    verifie: 'KYC Vérifié ✅',
    en_attente: 'KYC En attente',
    non_soumis: 'KYC Non soumis',
    rejete: 'KYC Rejeté',
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          ville: form.ville,
        }),
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const kycStatus = (profile?.kyc_status ?? 'non_soumis') as keyof typeof kycVariant
  const totalInvesti = profile?.total_investi ?? 0
  const totalROI = profile?.total_roi ?? 0

  if (loading) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Mon Profil">
        <div className="max-w-2xl space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Mon Profil">
      <div className="max-w-2xl space-y-6">

        {/* Avatar + infos principales */}
        <div className="card p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {(form.prenom[0] ?? '?')}{(form.nom[0] ?? '')}
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-gray-800">
              {form.prenom} {form.nom}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5 capitalize">{profile?.role ?? 'investisseur'}</p>
            <div className="mt-2">
              <Badge variant={kycVariant[kycStatus]}>
                {kycLabel[kycStatus]}
              </Badge>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-outline px-4 py-2 text-sm flex items-center gap-1.5' : 'btn-secondary px-4 py-2 text-sm flex items-center gap-1.5'}
          >
            {editing ? <><X size={14} /> Annuler</> : <><Edit3 size={14} /> Modifier</>}
          </button>
        </div>

        {/* Formulaire */}
        <div className="card p-6 space-y-5">
          <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-semibold text-gray-800 text-lg">
            Informations personnelles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Prénom', key: 'prenom', icon: <User size={15} /> },
              { label: 'Nom', key: 'nom', icon: <User size={15} /> },
              { label: 'Email', key: 'email', icon: <Mail size={15} />, readonly: true },
              { label: 'Téléphone', key: 'telephone', icon: <Phone size={15} /> },
              { label: 'Ville', key: 'ville', icon: <MapPin size={15} /> },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  {field.icon} {field.label}
                </label>
                {editing && !field.readonly ? (
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="input-field w-full text-sm py-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800 py-2 border-b border-gray-100">
                    {form[field.key as keyof typeof form] || '—'}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Calendar size={15} /> Membre depuis
              </label>
              <p className="text-sm font-medium text-gray-800 py-2 border-b border-gray-100">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('fr-CI', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-70"
            >
              {saving
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Save size={15} /> Enregistrer les modifications</>
              }
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-semibold text-gray-800 text-lg mb-4">
            Statistiques
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-700">
                {totalInvesti >= 1_000_000
                  ? `${(totalInvesti / 1_000_000).toFixed(1)}M`
                  : formatCurrency(totalInvesti)}
              </p>
              <p className="text-xs text-gray-500 mt-1">FCFA investis</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-amber-700">
                {totalROI >= 1_000_000
                  ? `${(totalROI / 1_000_000).toFixed(2)}M`
                  : formatCurrency(totalROI)}
              </p>
              <p className="text-xs text-gray-500 mt-1">FCFA de ROI</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-700">
                {totalInvesti > 0 ? ((totalROI / totalInvesti) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">ROI moyen</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
