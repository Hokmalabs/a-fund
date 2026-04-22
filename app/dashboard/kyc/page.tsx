'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { useProfile } from '@/lib/hooks/useProfile'
import { DASHBOARD_NAV } from '@/lib/constants'
import { ShieldCheck, Upload, CheckCircle, Clock, FileText, User, CreditCard } from 'lucide-react'

const steps = [
  { id: 1, label: 'Identité', icon: <User size={18} />, desc: 'Pièce d\'identité nationale ou passeport' },
  { id: 2, label: 'Justificatif', icon: <FileText size={18} />, desc: 'Justificatif de domicile de moins de 3 mois' },
  { id: 3, label: 'Fiscal', icon: <CreditCard size={18} />, desc: 'Numéro de contribuable ou attestation fiscale' },
]

export default function KycPage() {
  const { profile } = useProfile()
  const [uploaded, setUploaded] = useState<Record<number, string>>({})

  const kycVariant = {
    verifie: 'success',
    en_attente: 'warning',
    non_soumis: 'gray',
    rejete: 'error',
  } as const

  const kycLabel = {
    verifie: 'Vérifié',
    en_attente: 'En attente de vérification',
    non_soumis: 'Non soumis',
    rejete: 'Rejeté',
  }

  const handleUpload = (stepId: number) => {
    setUploaded(prev => ({ ...prev, [stepId]: 'document.pdf' }))
  }

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Vérification KYC">
      <div className="max-w-2xl space-y-6">

        {/* Statut actuel */}
        <div className="card p-6 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            (profile?.kyc_status ?? 'non_soumis') === 'verifie' ? 'bg-green-100' :
            (profile?.kyc_status ?? 'non_soumis') === 'en_attente' ? 'bg-amber-100' : 'bg-gray-100'
          }`}>
            <ShieldCheck size={28} className={
              (profile?.kyc_status ?? 'non_soumis') === 'verifie' ? 'text-green-600' :
              (profile?.kyc_status ?? 'non_soumis') === 'en_attente' ? 'text-amber-500' : 'text-gray-400'
            } />
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-lg font-bold text-gray-800">
              Statut de vérification
            </h2>
            <div className="mt-1">
              <Badge variant={kycVariant[(profile?.kyc_status ?? 'non_soumis')]}>
                {kycLabel[(profile?.kyc_status ?? 'non_soumis')]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Avantages KYC */}
        {(profile?.kyc_status ?? 'non_soumis') !== 'verifie' && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-green-800 mb-2">Pourquoi vérifier votre identité ?</p>
            <ul className="space-y-1.5 text-sm text-green-700">
              {[
                'Accéder à toutes les campagnes sans limite',
                'Effectuer des retraits vers votre compte mobile money',
                'Bénéficier d\'une protection renforcée de votre compte',
                'Conforme aux réglementations financières UEMOA',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Étapes */}
        <div className="card p-6 space-y-4">
          <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-semibold text-gray-800 text-lg">
            Documents requis
          </h3>

          {steps.map(step => {
            const done = (profile?.kyc_status ?? 'non_soumis') === 'verifie' || !!uploaded[step.id]
            return (
              <div key={step.id} className={`rounded-xl border p-4 flex items-center gap-4 transition-all ${
                done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                <div className={`p-2.5 rounded-lg ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  {uploaded[step.id] && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={11} /> {uploaded[step.id]}
                    </p>
                  )}
                </div>
                {done ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <button
                    onClick={() => handleUpload(step.id)}
                    className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Upload size={12} /> Envoyer
                  </button>
                )}
              </div>
            )
          })}

          {(profile?.kyc_status ?? 'non_soumis') !== 'verifie' && (
            <button
              disabled={Object.keys(uploaded).length < steps.length}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              Soumettre pour vérification
            </button>
          )}
        </div>

        {/* Délai */}
        {(profile?.kyc_status ?? 'non_soumis') !== 'verifie' && (
          <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            <Clock size={16} className="text-gray-400 flex-shrink-0" />
            La vérification prend généralement <strong>24 à 48 heures ouvrables</strong>.
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}