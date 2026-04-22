
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import { COOPERATIVE_NAV } from '@/lib/constants'
import { FileText, Upload, Eye, Download, Plus, Calendar, Sprout, CheckCircle } from 'lucide-react'

const campaigns: { id: string; titre: string }[] = []

const mockReports = [
  { id: 'r001', campaignId: 'c001', campaignTitre: 'Tomates cerises bio', type: 'Rapport mensuel', mois: 'Avril 2024', agronome: 'Dr. Kouassi Emmanuel', scoreVisite: 94, statut: 'publie', datePublication: '2024-05-01', observations: 'Croissance excellente. Irrigation goutte-à-goutte fonctionnelle. Aucune maladie détectée.', recommandations: 'Maintenir le programme de fertilisation. Prévoir la récolte début juillet.' },
  { id: 'r002', campaignId: 'c001', campaignTitre: 'Tomates cerises bio', type: 'Rapport mensuel', mois: 'Mars 2024', agronome: 'Dr. Kouassi Emmanuel', scoreVisite: 91, statut: 'publie', datePublication: '2024-04-02', observations: 'Semis réalisés avec succès. Taux de germination de 96%.', recommandations: 'Renforcer l\'arrosage en période sèche.' },
  { id: 'r003', campaignId: 'c002', campaignTitre: 'Maïs hybride N\'Zi', type: 'Rapport mensuel', mois: 'Avril 2024', agronome: 'M. Bamba Seydou', scoreVisite: 88, statut: 'publie', datePublication: '2024-05-03', observations: 'Plants en phase de croissance végétative. Densité conforme aux normes.', recommandations: 'Application d\'urée recommandée dans 2 semaines.' },
  { id: 'r004', campaignId: 'c004', campaignTitre: 'Anacarde Côte Ouest', type: 'Rapport de récolte', mois: 'Juillet 2024', agronome: 'Mme. Touré Aïssatou', scoreVisite: 96, statut: 'brouillon', datePublication: '', observations: 'Début de la récolte prévu. Qualité des noix W210 conforme aux standards OLAM.', recommandations: 'Mobiliser les équipes de cueillette pour semaine 28.' },
]

const statutVariant: Record<string, 'success' | 'gray'> = {
  publie: 'success', brouillon: 'gray',
}

export default function CoopReportsPage() {
  const [selected, setSelected] = useState<typeof mockReports[0] | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <DashboardLayout navItems={COOPERATIVE_NAV} title="Rapports agronomiques">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{mockReports.length} rapport(s) au total</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={15} /> Nouveau rapport
          </button>
        </div>

        {/* Formulaire nouveau rapport */}
        {showForm && (
          <div className="card p-6 border-l-4 border-l-green-500">
            <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 mb-4">
              Soumettre un rapport agronomique
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Campagne concernée</label>
                <select className="input-field w-full text-sm py-2">
                  {campaigns.slice(0, 4).map(c => (
                    <option key={c.id}>{c.titre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type de rapport</label>
                <select className="input-field w-full text-sm py-2">
                  <option>Rapport mensuel</option>
                  <option>Rapport de récolte</option>
                  <option>Rapport d'incident</option>
                  <option>Rapport final</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Période</label>
                <input type="month" className="input-field w-full text-sm py-2" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Score de visite (/100)</label>
                <input type="number" min="0" max="100" className="input-field w-full text-sm py-2" placeholder="Ex: 92" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Observations</label>
                <textarea rows={3} className="input-field w-full text-sm py-2 resize-none" placeholder="Observations de terrain..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Recommandations</label>
                <textarea rows={2} className="input-field w-full text-sm py-2 resize-none" placeholder="Recommandations pour la prochaine période..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Photos de terrain</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-green-300 transition-colors cursor-pointer">
                  <Upload size={20} className="text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Glissez vos photos ici</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-primary text-sm flex items-center gap-2">
                <CheckCircle size={14} /> Publier le rapport
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm">
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Liste rapports */}
          <div className="space-y-3">
            {mockReports.map(report => (
              <button
                key={report.id}
                onClick={() => setSelected(report)}
                className={`w-full text-left card p-4 hover:shadow-md transition-all ${selected?.id === report.id ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                      <FileText size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{report.type} — {report.mois}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Sprout size={10} /> {report.campaignTitre}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{report.agronome}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge variant={statutVariant[report.statut]} size="sm">
                      {report.statut === 'publie' ? 'Publié' : 'Brouillon'}
                    </Badge>
                    <span className={`text-xs font-bold ${report.scoreVisite >= 90 ? 'text-green-600' : 'text-amber-500'}`}>
                      Score : {report.scoreVisite}/100
                    </span>
                  </div>
                </div>
                {report.datePublication && (
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar size={10} /> Publié le {new Date(report.datePublication).toLocaleDateString('fr-CI', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Détail rapport */}
          <div>
            {selected ? (
              <div className="card p-6 space-y-5 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800">
                    {selected.type}
                  </h3>
                  <Badge variant={statutVariant[selected.statut]}>
                    {selected.statut === 'publie' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Campagne', value: selected.campaignTitre },
                    { label: 'Période', value: selected.mois },
                    { label: 'Agronome', value: selected.agronome },
                    { label: 'Score visite', value: `${selected.scoreVisite}/100` },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="font-semibold text-gray-800 mt-0.5 text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Observations</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 rounded-xl p-4">{selected.observations}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommandations</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-green-50 rounded-xl p-4">{selected.recommandations}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 btn-outline text-sm flex items-center justify-center gap-2">
                    <Eye size={14} /> Aperçu
                  </button>
                  <button className="flex-1 btn-outline text-sm flex items-center justify-center gap-2">
                    <Download size={14} /> PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center text-gray-400 flex flex-col items-center justify-center min-h-64">
                <FileText size={36} className="mb-3 opacity-30" />
                <p className="text-sm">Sélectionnez un rapport pour voir les détails</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}