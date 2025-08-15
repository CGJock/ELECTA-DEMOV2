'use client'

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PoliticalParty } from "@/types/election"
import { mockParties } from "@data/mockData"
import { useTranslation } from 'react-i18next'
import { useSocketData } from '@contexts/context' 
import { CandidateModal } from '@components/CandidateModal'


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

  

  console.log('globalsummary',globalSummary)

   if (!globalSummary && !breakdownLocData) {
    return <div className="text-white p-4">{t('loading')}...</div>;
  }

  // Base de partidos (estructura estática con nombres, fotos, etc.)
  const parties = initialParties;

  // Fuente dinámica de votos y porcentajes
  // Fuente dinámica de votos y porcentajes
  const sourcePartyBreakdown = selectedLocationCode && breakdownLocData
  ? breakdownLocData?.partyBreakdown
  : globalSummary?.politicalParties; 

  console.log('datadelasparties',sourcePartyBreakdown)

  // Enriquecer partidos con datos del backend
  const defaultPhoto = '/img/default-candidate.svg';

// Partidos que vienen del backend
const backendParties = sourcePartyBreakdown || [];

// Enriquecer con data del mock (foto, nombre extra), o usar defaults
const enrichedParties = backendParties.map((backendParty) => {
  // Buscar coincidencia en mockParties
  const match = parties.find((p) => {
    const aliases = p.aliases?.length ? p.aliases : [p.abbreviation];
    const normalizedAliases = aliases.map(a => a.trim().toLowerCase());
    return normalizedAliases.includes((backendParty.abbr || '').trim().toLowerCase());
  });

  return {
    id: backendParty.abbr || backendParty.name, // por si el backend no tiene id
    name: match?.name || backendParty.name,
    abbreviation: backendParty.abbr || '',
    count: backendParty.count,
    percentage: backendParty.percentage,
    candidate: {
      name: match?.candidate.name || backendParty.name,
      photo: match?.candidate.photo || defaultPhoto
    }
  };
});

  // Ordenar por total de votos
  const sortedParties = [...enrichedParties].sort((a, b) => {
  const countA = typeof a.count === 'number' ? a.count : -1;
  const countB = typeof b.count === 'number' ? b.count : -1;
  return countB - countA;
});

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
        className={`w-full max-w-[350px] bg-[#1e293b] shadow-md rounded-xl p-3 flex flex-col items-center border border-gray-700 mx-auto mt-4 mb-4 transition-all duration-500 ease-in-out overflow-hidden`}
        style={{
          maxHeight: isExpanded ? '700px' : '400px',
        }}
      >

      {/* Título con ubicación */}
      <div className="w-full text-center text-sm font-semibold text-white mb-2 select-none">
        {t('result')}: {locationName}
      </div>

      {/* Header row: Party and Votes */}
      <div className="w-full text-sm font-medium text-gray-300 flex justify-between px-2 mb-2">
        <span>{t('parties.title')}</span>
        <span>{t('parties.votes')}</span>
      </div>

      {/* Lista de partidos */}
      <div className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
        isExpanded ? "gap-[2px]" : "gap-4"
      }`}>
        {visibleParties.map((party, index) => (
          <div
            key={party.id}
            className={`w-full flex items-center justify-between gap-3 rounded-md border border-gray-700 shadow-sm text-white transition-all duration-300 mb-2
            ${isExpanded ? "text-sm py-2 px-3" : "text-base py-2 px-4"}`}
            style={{
              background: '#22304a',
              animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* Foto y nombre */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleCandidateClick(party)}
            >
              <img
                src={party.candidate.photo}
                alt={party.candidate.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold leading-tight text-white">{party.name}</div>
                <div className="text-xs text-gray-400">{party.abbreviation}</div>
              </div>
            </div>

            {/* Total de votos */}
            <div className="text-right font-medium">
               {typeof party.count === 'number' ? party.count.toLocaleString('es-US') : 'Cargando datos'}
            </div>
          </div>
        ))}
      </div>

      {/* Botón de expandir */}
      {parties.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-3 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200
            ${isExpanded ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700' : 'bg-emerald-500 text-primary hover:bg-emerald-600'}`}
          style={{
            fontSize: isExpanded ? '1rem' : '0.9rem',
            minHeight: '36px',
            marginBottom: isExpanded ? '1rem' : '0.2rem'
          }}
        >
          <span>{isExpanded ? t('parties.ver_menos') : t('parties.ver_mas')}</span>
          {isExpanded ? <ChevronUp  size={20} /> : <ChevronDown size={16} />}
        </button>
      )}

      {/* Modal */}
      {/* {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCandidate(null)
          }}
        />
      )} */}
    </div>
  )
}