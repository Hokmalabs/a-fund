'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sprout, ArrowRight, ShieldCheck, CheckCircle, User, Building2, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Role = 'investisseur' | 'cooperative'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('investisseur')
  const [step, setStep] = useState<1 | 2>(1)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', confirmPassword: '',
    nomCoop: '', rccm: '', responsable: '',
    acceptCgu: false,
  })

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm(p => ({ ...p, [key]: value }))

  const validateStep1 = () => {
    if (!form.email || !form.password) { setError('Email et mot de passe requis.'); return false }
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return false }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return false }
    setError(''); return true
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async () => {
    if (!form.prenom || !form.nom) { setError('Prénom et nom requis.'); return }
    if (!form.acceptCgu) { setError('Vous devez accepter les CGU.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { nom: form.nom, prenom: form.prenom },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: form.email,
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || null,
        ville: form.ville || null,
        role,
      })
    }

    // Si pas de session, confirmation email requise
    if (!data.session) {
      setEmailSent(true)
      setLoading(false)
      return
    }

    document.cookie = `afund_role=${role}; path=/; max-age=86400; SameSite=Lax`
    router.push(role === 'cooperative' ? '/cooperative/dashboard' : '/onboarding')
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-green-600" />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-gray-800 mb-3">
            Vérifiez votre email
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Un lien de confirmation a été envoyé à <strong>{form.email}</strong>.<br />
            Cliquez sur le lien pour activer votre compte.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            <ArrowRight size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-green-600 p-2 rounded-xl">
              <Sprout size={22} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-gray-800">
              A-FUND
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-gray-800">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gratuit et sans engagement</p>
        </div>

        {/* Choix du rôle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { value: 'investisseur', label: 'Investisseur', desc: 'Je veux investir', icon: <User size={20} /> },
            { value: 'cooperative', label: 'Coopérative', desc: 'Je cherche des fonds', icon: <Building2 size={20} /> },
          ] as const).map(r => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`card p-4 text-center transition-all ${role === r.value ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`mx-auto mb-2 w-10 h-10 rounded-full flex items-center justify-center ${role === r.value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {r.icon}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{r.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Coopérative : inscription via l'équipe uniquement */}
        {role === 'cooperative' && (
          <div className="card p-6 text-center border-amber-200 bg-amber-50 mb-6">
            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-amber-600" />
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-lg font-bold text-gray-800 mb-2">
              Inscription coopérative
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Les comptes coopératives sont créés par notre équipe après vérification
              de vos documents (RCCM, statuts, certification agronomique).
            </p>
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <ArrowRight size={15} /> Contactez-nous
            </Link>
            <p className="text-xs text-gray-400 mt-3">
              Réponse sous 48h ouvrées
            </p>
          </div>
        )}

        {/* Stepper + formulaire — investisseur uniquement */}
        {role === 'investisseur' && <>
          <div className="flex items-center gap-3 mb-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                <span className={`text-xs ${step >= s ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Identifiants' : 'Profil'}
                </span>
                {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-green-300' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

        {/* Card */}
        <div className="card p-8 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Étape 1 : Identifiants */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Adresse email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="input-field w-full py-3 text-sm"
                  placeholder="jean@exemple.ci"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={e => set('telephone', e.target.value)}
                  className="input-field w-full py-3 text-sm"
                  placeholder="+225 07 00 00 00 00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className="input-field w-full py-3 text-sm pr-10"
                    placeholder="Minimum 8 caractères"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-1.5 flex gap-1">
                    {[4, 6, 8, 10].map(len => (
                      <div key={len} className={`flex-1 h-1 rounded-full ${form.password.length >= len ? 'bg-green-500' : 'bg-gray-100'}`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  className={`input-field w-full py-3 text-sm ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-300' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              <button onClick={handleNext} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                Continuer <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* Étape 2 : Profil */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Prénom *</label>
                  <input type="text" value={form.prenom} onChange={e => set('prenom', e.target.value)} className="input-field w-full py-2.5 text-sm" placeholder="Jean" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Nom *</label>
                  <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)} className="input-field w-full py-2.5 text-sm" placeholder="Kouamé" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Ville</label>
                <input type="text" value={form.ville} onChange={e => set('ville', e.target.value)} className="input-field w-full py-2.5 text-sm" placeholder="Abidjan" />
              </div>

              {role === 'cooperative' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Nom de la coopérative *</label>
                    <input type="text" value={form.nomCoop} onChange={e => set('nomCoop', e.target.value)} className="input-field w-full py-2.5 text-sm" placeholder="Ex: Coopérative Agri-Bouaké" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Numéro RCCM</label>
                    <input type="text" value={form.rccm} onChange={e => set('rccm', e.target.value)} className="input-field w-full py-2.5 text-sm" placeholder="CI-ABJ-2024-C-XXXXX" />
                  </div>
                </>
              )}

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cgu"
                  checked={form.acceptCgu}
                  onChange={e => set('acceptCgu', e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-green-600"
                />
                <label htmlFor="cgu" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                  J'accepte les{' '}
                  <Link href="/legal/terms" className="text-green-600 hover:underline">Conditions Générales</Link>
                  {' '}et la{' '}
                  <Link href="/legal/privacy" className="text-green-600 hover:underline">Politique de confidentialité</Link>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline px-4 py-2.5 text-sm">
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><CheckCircle size={15} /> Créer mon compte</>
                  }
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-green-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
          <ShieldCheck size={13} />
          Inscription sécurisée SSL
        </div>

      </>}

      </div>
    </div>
  )
}