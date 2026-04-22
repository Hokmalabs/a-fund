'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DASHBOARD_NAV, PAYMENT_METHODS } from '@/lib/constants'
import { useProfile } from '@/lib/hooks/useProfile'
import { formatCurrencyFull } from '@/lib/utils'

export default function WithdrawPage() {
  const { profile } = useProfile()
  const soldeWallet = profile?.solde_wallet ?? 0
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('orange_money')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const num = parseInt(amount) || 0
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method)
  const mobilePayMethods = PAYMENT_METHODS.filter(m => m.id !== 'carte_bancaire')

  if (sent) {
    return (
      <DashboardLayout navItems={DASHBOARD_NAV} title="Retirer des fonds">
        <div className="max-w-lg mx-auto">
          <div className="card p-10 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Retrait en cours
            </h2>
            <p className="text-gray-500 mb-2">
              Votre retrait de{' '}
              <strong className="text-gray-800">{formatCurrencyFull(num)}</strong>{' '}
              a été soumis avec succès.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Les fonds seront transférés sur votre compte{' '}
              {selectedMethod?.label} sous 24h ouvrées.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-2">
              {[
                { label: 'Montant demandé', value: formatCurrencyFull(num) },
                { label: 'Méthode', value: selectedMethod?.icon + ' ' + selectedMethod?.label },
                { label: 'Téléphone', value: phone },
                { label: 'Délai', value: 'Sous 24h ouvrées' },
                { label: 'Frais', value: 'Gratuit' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={'font-semibold ' + (item.label === 'Frais' ? 'text-green-600' : 'text-gray-800')}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/wallet" className="btn-outline flex-1 text-sm">
                Mon wallet
              </Link>
              <button
                onClick={() => { setSent(false); setAmount(''); setPhone('') }}
                className="btn-primary flex-1 text-sm"
              >
                Nouveau retrait
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Retirer des fonds">
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au wallet
        </Link>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Retirer des fonds
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Transférez vos fonds vers votre mobile money en quelques clics.
          </p>

          {/* Solde dispo */}
          <div className="bg-primary-50 rounded-2xl p-5 mb-6">
            <p className="text-sm text-primary-700 font-medium mb-1">Solde disponible</p>
            <p className="text-3xl font-bold text-primary-900" style={{ fontFamily: 'Georgia, serif' }}>
              {formatCurrencyFull(soldeWallet)}
            </p>
            <p className="text-xs text-primary-600 mt-1">
              Maximum retirable : {formatCurrencyFull(soldeWallet)}
            </p>
          </div>

          <div className="space-y-5">
            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Montant à retirer
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="input-field pr-16"
                  placeholder="Min. 10 000 FCFA"
                  min={10000}
                  max={soldeWallet}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  FCFA
                </span>
              </div>
              {num > 0 && num < 10000 && (
                <p className="text-xs text-red-500 mt-1">Minimum 10 000 FCFA</p>
              )}
              {num > soldeWallet && (
                <p className="text-xs text-red-500 mt-1">
                  Solde insuffisant
                </p>
              )}
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {[50000, 100000, 250000, 500000].map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={
                      'text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ' +
                      (num === a
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-primary-300')
                    }
                  >
                    {formatCurrencyFull(a)}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(String(soldeWallet))}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-primary-300 font-medium transition-all"
                >
                  Tout retirer
                </button>
              </div>
            </div>

            {/* Method */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Méthode de retrait
              </label>
              <div className="space-y-2">
                {mobilePayMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={
                      'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ' +
                      (method === m.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300')
                    }
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className={'font-semibold text-sm ' + (method === m.id ? 'text-primary-700' : 'text-gray-700')}>
                      {m.label}
                    </span>
                    {method === m.id && (
                      <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field"
                placeholder="+225 07 XX XX XX XX"
              />
            </div>

            {/* Summary */}
            {num >= 10000 && num <= soldeWallet && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Montant demandé</span>
                  <span className="font-semibold">{formatCurrencyFull(num)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Frais de retrait</span>
                  <span className="font-semibold text-green-600">Gratuit</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                  <span>Vous recevrez</span>
                  <span className="text-primary-600">{formatCurrencyFull(num)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setSent(true)}
              disabled={num < 10000 || num > soldeWallet || !phone}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Demander le retrait
            </button>
            <p className="text-xs text-gray-400 text-center">
              Traitement sous 24h · 2 retraits gratuits par mois
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}