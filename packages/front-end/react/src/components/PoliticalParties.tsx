'use client'

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PoliticalParty } from '@/types/election';
import { mockParties } from '@data/mockData';
import { useTranslation } from 'react-i18next'
import { useSocketData } from '@contexts/context';
import { CandidateModal } from '@components/CandidateModal';

interface PoliticalPartiesProps {
  parties?: PoliticalParty[]
  onPartiesChange?: (parties: PoliticalParty[]) => void
}

export function PoliticalParties({
  parties: initialParties = mockParties,
  onPartiesChange,
}: PoliticalPartiesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<PoliticalParty | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { t } = useTranslation();
  const { selectedLocationCode, globalSummary, breakdownLocData } = useSocketData();

  // Base de partidos (estructura estática con nombres, fotos, etc.)
  const parties = initialParties;

  // Fuente dinámica de votos y porcentajes
  const source = selectedLocationCode && breakdownLocData
    ? breakdownLocData
    : globalSummary;

  console.log(`info para political parties ${JSON.stringify(source?.partyBreakdown)}`)

  // Enriquecer partidos con datos actualizados del socket
const enrichedParties = parties.map((party) => {
  // Usa aliases si existen, si no, usa abbreviation en un array
  const aliasList = party.aliases && party.aliases.length > 0
    ? party.aliases
    : [party.abbreviation];

  // Normaliza aliases para comparación segura
  const normalizedAliases = aliasList.map(a => a.trim().toLowerCase());

  // Buscar match en source.partyBreakdown
  const match = source?.partyBreakdown.find(p => {
    if (!p.abbr) return false;
    const abbrNormalized = p.abbr.trim().toLowerCase();
    return normalizedAliases.includes(abbrNormalized);
  });

  return {
    ...party,
    count: match?.count ?? 0,
    percentage: match?.percentage ?? '0.00',
  };
});

  // Ordenar por total de votos
  const sortedParties = [...enrichedParties].sort((a, b) => b.count - a.count);

  // Top 3 si está colapsado
  const visibleParties = isExpanded ? sortedParties : sortedParties.slice(0, 3);

  // Nombre de la ubicación actual o "Nacionales"
  const locationName =
    selectedLocationCode !== null && breakdownLocData?.locationName
      ? breakdownLocData.locationName
      : t('map.national');

  const handleCandidateClick = (party: PoliticalParty) => {
    setSelectedCandidate(party)
    setIsModalOpen(true)
  }

  return (
    <div
        className={`w-full max-w-[380px] relative mx-auto mt-6 mb-6 transition-all duration-700 ease-out overflow-hidden`}
        style={{
          maxHeight: isExpanded ? undefined : '520px',
        }}
      >
      {/* Contenedor principal con glassmorphism */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
        {/* Efectos de fondo decorativos */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80" />
        
        {/* Contenido principal */}
        <div className="relative z-10 p-6">
          {/* Título con ubicación */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3 animate-pulse" />
              <span className="text-sm font-semibold text-slate-200 tracking-wide">
                {t('result')}: <span className="text-white font-bold">{locationName}</span>
              </span>
            </div>
          </div>

          {/* Header row: Party and Votes */}
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              {t('parties.title')}
            </span>
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              {t('parties.votes')}
            </span>
          </div>

          {/* Lista de partidos */}
          <div className={`space-y-3 transition-all duration-500 ${
            isExpanded ? "space-y-2" : "space-y-3"
          }`}>
            {visibleParties.map((party, index) => (
              <div
                key={party.id}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                  isExpanded ? "py-3 px-4" : "py-4 px-5"
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                  pointerEvents: party.disqualified ? 'none' : 'auto',
                  opacity: party.disqualified ? 0.7 : 1,
                }}
                onClick={() => !party.disqualified && handleCandidateClick(party)}
              >
                {/* Efecto hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Overlay de descalificación */}
                {party.disqualified && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 px-2 py-3">
                      <span className="text-white font-semibold text-base drop-shadow-sm">
                        {party.candidate.name} ({party.abbreviation})
                      </span>
                      <span className="text-slate-200 font-normal text-sm text-center">
                        {t('parties.disqualified_disclaimer')}
                      </span>
                    </div>
                  </div>
                )}
                {/* Ranking indicator */}
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r-full transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />

                <div className="relative z-10 flex items-center justify-between">
                  {/* Foto y nombre */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={party.candidate.photo}
                        alt={party.candidate.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/50 shadow-lg group-hover:border-slate-400/50 transition-colors duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base mb-1 group-hover:text-blue-100 transition-colors duration-300">
                        {party.name}
                      </div>
                      <div className="text-xs text-blue-200 font-medium">
                        {party.candidate.name}
                      </div>
                    </div>
                  </div>

                  {/* Total de votos */}
                  <div className="text-right font-medium">
                    {party.count}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón de expandir */}
          {parties.length > 3 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`group relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isExpanded 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg hover:from-slate-600 hover:to-slate-500' 
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg hover:from-emerald-500 hover:to-emerald-400'
                }`}
              >
                {/* Efecto shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative flex items-center gap-2">
                  <span className="tracking-wide">
                    {isExpanded ? t('parties.ver_menos') : t('parties.ver_mas')}
                  </span>
                  <div className="transform transition-transform duration-300 group-hover:scale-110">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCandidate(null)
          }}
        />
      )}
    </div>
  )
}





