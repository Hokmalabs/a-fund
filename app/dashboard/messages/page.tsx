'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DASHBOARD_NAV } from '@/lib/constants'
import { MessageCircle, Send, Search } from 'lucide-react'

const mockConversations = [
  {
    id: 'm001',
    nom: 'Coopérative Agri-Bouaké',
    avatar: 'CA',
    dernier: 'Merci pour votre investissement, nous démarrons la production la semaine prochaine.',
    date: '2024-05-01',
    nonLu: 2,
  },
  {
    id: 'm002',
    nom: 'Support A-FUND',
    avatar: 'AF',
    dernier: 'Votre demande de retrait a bien été traitée.',
    date: '2024-04-28',
    nonLu: 0,
  },
  {
    id: 'm003',
    nom: 'Coop. Vallée du N\'Zi',
    avatar: 'VN',
    dernier: 'Le rapport agronomique du mois d\'avril est disponible.',
    date: '2024-04-20',
    nonLu: 1,
  },
]

const mockMessages: Record<string, { id: string; from: 'me' | 'other'; texte: string; date: string }[]> = {
  m001: [
    { id: '1', from: 'other', texte: 'Bonjour, merci pour votre confiance et votre investissement dans notre campagne tomates cerises.', date: '2024-03-06' },
    { id: '2', from: 'me', texte: 'Bonjour ! Avec plaisir. Comment avance la préparation des terres ?', date: '2024-03-06' },
    { id: '3', from: 'other', texte: 'Très bien ! L\'irrigation goutte-à-goutte est installée. Merci pour votre investissement, nous démarrons la production la semaine prochaine.', date: '2024-05-01' },
  ],
  m002: [
    { id: '1', from: 'other', texte: 'Bonjour Jean-Baptiste, votre demande de retrait de 500 000 FCFA a bien été traitée.', date: '2024-04-28' },
    { id: '2', from: 'me', texte: 'Merci beaucoup !', date: '2024-04-28' },
  ],
  m003: [
    { id: '1', from: 'other', texte: 'Le rapport agronomique du mois d\'avril est disponible. La campagne se déroule très bien.', date: '2024-04-20' },
  ],
}

export default function MessagesPage() {
  const [selected, setSelected] = useState(mockConversations[0])
  const [search, setSearch] = useState('')
  const [newMsg, setNewMsg] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  const conversations = mockConversations.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  )

  const send = () => {
    if (!newMsg.trim()) return
    setMessages(prev => ({
      ...prev,
      [selected.id]: [
        ...(prev[selected.id] || []),
        { id: Date.now().toString(), from: 'me', texte: newMsg.trim(), date: new Date().toISOString().split('T')[0] }
      ]
    }))
    setNewMsg('')
  }

  return (
    <DashboardLayout navItems={DASHBOARD_NAV} title="Messages">
      <div className="card overflow-hidden flex h-[600px]">

        {/* Sidebar conversations */}
        <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-8 py-1.5 text-sm w-full"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={`w-full text-left p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  selected.id === conv.id ? 'bg-green-50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 truncate">{conv.nom}</p>
                    {conv.nonLu > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {conv.nonLu}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{conv.dernier}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Zone messages */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
              {selected.avatar}
            </div>
            <p className="font-semibold text-gray-800 text-sm">{selected.nom}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {(messages[selected.id] || []).map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'me'
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.texte}
                  <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-green-200' : 'text-gray-400'}`}>
                    {new Date(msg.date).toLocaleDateString('fr-CI', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Écrire un message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              className="input-field flex-1 py-2 text-sm"
            />
            <button onClick={send} className="btn-primary px-4 py-2 flex items-center gap-1.5 text-sm">
              <Send size={14} /> Envoyer
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}