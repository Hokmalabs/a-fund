'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, TrendingUp, ShieldCheck, Wallet, ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import { useProfile } from '@/lib/hooks/useProfile'

const buildSteps = (prenom?: string) => [
  {
    id: 1,
    icon: <Sprout size={36} className="text-green-500" />,
    titre: prenom ? `Bienvenue, ${prenom} ! 🌱` : 'Bienvenue sur A-FUND 🌱',
    sousTitre: 'La plateforme de crowdfunding agricole #1 en Côte d\'Ivoire',
    description: 'Investissez dans des projets agricoles certifiés et obtenez des rendements de 15 à 28% tout en soutenant les coopératives ivoiriennes.',
    action: null,
  },
  {
    id: 2,
    icon: <ShieldCheck size={36} className="text-green-500" />,
    titre: 'Vos investissements sont sécurisés',
    sousTitre: 'Protection à 3 niveaux',
    description: null,
    points: [
      { icon: '✅', text: 'Validation agronomique indépendante (score ≥ 80/100)' },
      { icon: '📄', text: 'Contrat d\'achat pré-signé avec acheteur vérifié' },
      { icon: '🛡️', text: 'Assurance récolte pour les campagnes éligibles' },
    ],
    action: null,
  },
  {
    id: 3,
    icon: <Wallet size={36} className="text-green-500" />,
    titre: 'Alimentez votre wallet',
    sousTitre: 'Déposez des fonds pour commencer à investir',
    description: 'Utilisez Orange Money, Wave, MTN Money ou virement bancaire. Minimum 10 000 FCFA.',
    action: { label: 'Déposer maintenant', href: '/dashboard/wallet/deposit' },
  },
  {
    id: 4,
    icon: <TrendingUp size={36} className="text-green-500" />,
    titre: 'Explorez les campagnes',
    sousTitre: 'Choisissez votre premier investissement',
    description: 'Parcourez nos campagnes certifiées, consultez les scores agronomiques et les contrats d\'achat.',
    action: { label: 'Voir les campagnes', href: '/campagnes' },
  },
  {
    id: 5,
    icon: <Star size={36} className="text-amber-400" />,
    titre: 'Vous êtes prêt ! 🎉',
    sousTitre: 'Votre espace investisseur vous attend',
    description: 'Accédez à votre tableau de bord pour suivre vos investissements, consulter vos rendements et explorer de nouvelles opportunités.',
    action: { label: 'Accéder à mon espace', href: '/dashboard' },
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { profile } = useProfile()
  const [current, setCurrent] = useState(0)
  const steps = buildSteps(profile?.prenom ?? undefined)
  const step = steps[current]
  const isLast = current === steps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="bg-green-600 p-2 rounded-xl">
            <Sprout size={20} className="text-white" />
          </div>
          <span style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-gray-800">
            A-FUND
          </span>
        </div>

        {/* Card */}
        <div className="card p-8 text-center">

          {/* Icône */}
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            {step.icon}
          </div>

          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-gray-800 mb-2">
            {step.titre}
          </h2>
          <p className="text-green-600 font-medium text-sm mb-4">{step.sousTitre}</p>

          {step.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{step.description}</p>
          )}

          {step.points && (
            <div className="space-y-3 mb-6 text-left">
              {step.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-3">
                  <span className="text-lg flex-shrink-0">{point.icon}</span>
                  <p className="text-sm text-gray-700 leading-snug">{point.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Action secondaire */}
          {step.action && (
            <Link
              href={step.action.href}
              className="btn-outline w-full flex items-center justify-center gap-2 text-sm mb-4"
            >
              {step.action.label} <ArrowRight size={14} />
            </Link>
          )}

          {/* Navigation */}
          <button
            onClick={() => {
              if (isLast) router.push('/dashboard')
              else setCurrent(c => c + 1)
            }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLast ? (
              <><CheckCircle size={16} /> Accéder au tableau de bord</>
            ) : (
              <>Suivant <ArrowRight size={16} /></>
            )}
          </button>

          {!isLast && (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs text-gray-400 hover:text-gray-600 mt-4 block mx-auto"
            >
              Passer l'introduction
            </button>
          )}
        </div>

        {/* Indicateurs */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-green-600' : 'w-2 h-2 bg-gray-200'}`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Étape {current + 1} sur {steps.length}
        </p>

      </div>
    </div>
  )
}