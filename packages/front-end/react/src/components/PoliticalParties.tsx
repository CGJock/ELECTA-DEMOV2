'use client'

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PoliticalParty } from '@/types/election';
import { mockParties } from '@data/mockData';
import { useTranslation } from 'react-i18next';
import { useSocketData } from '@contexts/context';
import { CandidateModal } from '@components/CandidateModal';

interface PoliticalPartiesProps {
  parties?: PoliticalParty[];
  onPartiesChange?: (parties: PoliticalParty[]) => void;
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

  // Party base (static structure with names, photos, etc.)
  const parties = initialParties;

  // Dynamic source of votes and percentages
  const source = selectedLocationCode && breakdownLocData
    ? breakdownLocData
    : globalSummary;

  console.log(`info para political parties ${JSON.stringify(source?.partyBreakdown)}`)

  // Enrich parties with updated data from socket
const enrichedParties = parties.map((party) => {
  // Use aliases if they exist, otherwise use abbreviation in an array
  const aliasList = party.aliases && party.aliases.length > 0
    ? party.aliases
    : [party.abbreviation];

  // Normalize aliases for safe comparison
  const normalizedAliases = aliasList.map(a => a.trim().toLowerCase());

  // Find match in source.partyBreakdown
  const match = source?.partyBreakdown.find(p => {
    if (!p.abbr) return false;
    const abbrNormalized = p.abbr.trim().toLowerCase();
    return normalizedAliases.includes(abbrNormalized);
  });

  return {
    ...party,
    count: match?.count ?? 0,
    percentage: match?.percentage ? Number(match.percentage) : undefined,
  };
});

  // Filter parties (fases eliminadas)
  const filteredParties = enrichedParties;

  // Sort parties by votes
  const sortedParties = filteredParties.sort((a, b) => (b.count || 0) - (a.count || 0));

  // Determine which parties to show (top 3 when collapsed, all when expanded)
  const visibleParties = isExpanded ? sortedParties : sortedParties.slice(0, 3);

  // Get location name
  const locationName = selectedLocationCode && breakdownLocData
    ? breakdownLocData.locationName
    : t('map.national');

  const handleCandidateClick = (party: PoliticalParty) => {
    setSelectedCandidate(party);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  // Mensaje especial de segunda vuelta eliminado

  return (
    <>
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
                {t('parties.title')}: <span className="text-white font-bold">{locationName}</span>
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
                className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/70 hover:bg-slate-800/60"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                  pointerEvents: (party.disqualified || party.withdrawalType) ? 'none' : 'auto',
                  opacity: (party.disqualified || party.withdrawalType) ? 0.7 : 1,
                }}
                onClick={() => !(party.disqualified || party.withdrawalType) && handleCandidateClick(party)}
              >
                {/* Efecto hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay de descalificación o retiro */}
                {(party.disqualified || party.withdrawalType) && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 px-2 py-3">
                      <span className="text-slate-100 font-semibold text-sm text-center">
                        {party.withdrawalType === 'withdrawn' 
                          ? t('parties.withdrawn_disclaimer')
                          : t('parties.disqualified_disclaimer')
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Contenido del partido */}
                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between">
                    {/* Información del candidato */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Foto del candidato */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={party.candidate.photo}
                          alt={party.candidate.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/img/default-candidate.svg';
                          }}
                        />
                        {/* Indicador de partido */}
                        <div 
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800"
                          style={{ backgroundColor: party.color }}
                        />
                      </div>

                      {/* Información del candidato */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-100 truncate">
                          {party.candidate.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {party.name}
                        </p>
                      </div>
                    </div>

                    {/* Votos */}
                    <div className="flex flex-col items-end gap-1 ml-4">
                      <span className="text-sm font-bold text-slate-100">
                        {party.count?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón expandir/colapsar */}
          {sortedParties.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm text-sm font-medium text-slate-200 hover:from-slate-600/60 hover:to-slate-500/60 transition-all duration-200"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    {t('parties.ver_menos')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    {t('parties.ver_mas')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de candidato */}
      {isModalOpen && selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}





