'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sprout, ArrowRight, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (authError || !data.user) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role ?? 'investisseur'
    const maxAge = form.remember ? 30 * 24 * 3600 : 86400
    document.cookie = `afund_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`

    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'cooperative') router.push('/cooperative/dashboard')
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
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
            Bienvenue 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Adresse email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="input-field w-full py-3 text-sm"
              placeholder="jean@exemple.ci"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500">Mot de passe</label>
              <Link href="/auth/forgot-password" className="text-xs text-green-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field w-full py-3 text-sm pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={form.remember}
              onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 accent-green-600"
            />
            <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer">
              Se souvenir de moi
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><ArrowRight size={16} /> Se connecter</>
            )}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-300">
            <div className="flex-1 h-px bg-gray-100" />
            <span>ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Comptes demo */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 text-center mb-2">Accès rapide (démo)</p>
            {[
              { label: 'Investisseur', email: 'jb.kouame@gmail.com' },
              { label: 'Coopérative', email: 'coop@agri-bouake.ci' },
              { label: 'Admin', email: 'admin@afund.ci' },
            ].map(demo => (
              <button
                key={demo.email}
                onClick={() => setForm(p => ({ ...p, email: demo.email, password: 'demo1234' }))}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm"
              >
                <span className="font-medium text-gray-700">{demo.label}</span>
                <span className="text-xs text-gray-400">{demo.email}</span>
              </button>
            ))}
          </div>

        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-green-600 font-medium hover:underline">
            S&apos;inscrire gratuitement
          </Link>
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
          <ShieldCheck size={13} />
          Connexion sécurisée SSL
        </div>

      </div>
    </div>
  )
}