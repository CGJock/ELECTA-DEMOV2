"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useSocketData } from '@contexts/context';
import { useElectionPhase } from '@/hooks/useElectionPhase';
import { mockParties } from '@data/mockData';
import FirstRoundSummaryModal from './FirstRoundSummaryModal';

interface SecondRoundCandidate {
  id: string;
  name: string;
  party: string;
  partyAbbr: string;
  photo: string;
  votes: number;
  percentage: number;
  color: string;
}

interface SecondRoundBannerProps {
  isVisible?: boolean;
  candidates?: SecondRoundCandidate[];
}

const SecondRoundBanner: React.FC<SecondRoundBannerProps> = ({
  isVisible = true,
  candidates
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { globalSummary } = useSocketData();
  const { isSecondRound, isPostFirstRound } = useElectionPhase();

  // Logic to automatically select the top 2 candidates
  const automaticCandidates = useMemo(() => {
    if (!globalSummary?.partyBreakdown || globalSummary.partyBreakdown.length < 2) {
      return null;
    }

    // Sort by votes descending and take the top 2
    const sortedCandidates = [...globalSummary.partyBreakdown]
      .filter(party => party.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 2);

    if (sortedCandidates.length < 2) {
      return null;
    }

    // Map to SecondRoundCandidate structure
    return sortedCandidates.map((candidate, index) => {
      // Find party data in mockParties to get photo and color
      const findCandidateData = (partyName: string) => {
        return mockParties.find((party) => 
          party.name.toLowerCase().includes(partyName.toLowerCase()) ||
          party.candidate.name.toLowerCase().includes(partyName.toLowerCase())
        );
      };

      const partyData = findCandidateData(candidate.name);
      
      return {
        id: `candidate-${index + 1}`,
        name: partyData?.candidate.name || candidate.name,
        party: partyData?.name || candidate.name,
        partyAbbr: partyData?.abbreviation || candidate.abbr,
        photo: partyData?.candidate.photo || `/img/${candidate.abbr}.png`,
        votes: candidate.count,
        percentage: typeof candidate.percentage === 'string' ? parseFloat(candidate.percentage) : candidate.percentage,
        color: partyData?.color || (index === 0 ? '#FF6B35' : '#4A90E2')
      };
    });
  }, [globalSummary]);

  // Use automatic candidates if available, otherwise use provided or default ones
  const displayCandidates = candidates || automaticCandidates || [
    {
      id: 'sergio-doria',
      name: 'Sergio Doria',
      party: 'Bloque de Unidad',
      partyAbbr: 'BDU',
      photo: '/img/SamuelDoriaMedina.BloqueDeUnidad.png',
      votes: 2847592,
      percentage: 45.2,
      color: '#FF6B35'
    },
    {
      id: 'jorge-tuto-quiroga',
      name: 'Jorge Tuto Quiroga',
      party: 'Alianza LIBRE',
      partyAbbr: 'LIBRE',
      photo: '/img/JorgeTutoQuiroga.AlianzaLIBRE.png',
      votes: 2650234,
      percentage: 42.1,
      color: '#FFD700'
    }
  ];

  // Show banner if visible and we are in the correct phase
  if (!isVisible || (!isSecondRound && !isPostFirstRound)) {
    return null;
  }

 

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-BO');
  };

  return (
    <>
      <div className="relative w-full mb-8" data-second-round-banner>
        {/* Contenedor principal con glassmorphism effect */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl max-w-7xl mx-auto">
        
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0">
          {/* Gradiente animado de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20 animate-pulse"></div>
          
          {/* Efectos de luz */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Patrón geométrico sutil */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          {/* Header elegante */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-white/60"></div>
              <div className="px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/90 text-sm font-medium tracking-wider uppercase">
                  {t('secondRound.bolivia_2025')}
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-white/60"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-2 tracking-tight">
              {t('secondRound.title')}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-light mb-2">
              {t('secondRound.definitive_election')}
            </p>
            <p className="text-white/60 text-base font-medium">
              {t('secondRound.date')}
            </p>
          </div>

          {/* Sección de candidatos */}
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            {/* Candidato 1 */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                {/* Foto del candidato */}
                <div className="relative mx-auto mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Anillo animado */}
                    <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-400 to-emerald-400 animate-spin-slow"></div>
                    <div 
                      className="absolute inset-2 rounded-full border-2 animate-reverse-spin"
                      style={{ borderColor: displayCandidates[0].color }}
                    ></div>
                    
                    {/* Imagen */}
                    <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-white/20">
                      <Image
                        src={displayCandidates[0].photo}
                        alt={displayCandidates[0].name}
                        fill
                        className="object-cover filter brightness-110"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Info del candidato */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    {displayCandidates[0].name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: displayCandidates[0].color }}
                      ></div>
                      <span className="text-sm font-medium text-white/90">
                        {displayCandidates[0].partyAbbr}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/70 px-2">
                      {displayCandidates[0].party}
                    </p>
                  </div>
                  
                  {/* Estadísticas */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-2xl font-black text-white mb-1">
                      {displayCandidates[0].percentage}%
                    </div>
                    <div className="text-xs text-white/60">
                      {formatNumber(displayCandidates[0].votes)} {t('secondRound.votes')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Centro - VS */}
            <div className="relative flex flex-col items-center justify-center py-8">
              {/* Efectos de fondo para el VS */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/5 rounded-full animate-ping"></div>
                <div className="absolute w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-full animate-pulse"></div>
              </div>
              
              {/* VS principal */}
              <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-white/20 shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  VS
                </span>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-white/80 mb-1">{t('secondRound.final_confrontation')}</p>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{t('secondRound.live_status')}</span>
                </div>
              </div>
            </div>

            {/* Candidato 2 */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                {/* Foto del candidato */}
                <div className="relative mx-auto mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Anillo animado */}
                    <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-emerald-400 to-blue-400 animate-spin-slow"></div>
                    <div 
                      className="absolute inset-2 rounded-full border-2 animate-reverse-spin"
                      style={{ borderColor: displayCandidates[1].color }}
                    ></div>
                    
                    {/* Imagen */}
                    <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-white/20">
                      <Image
                        src={displayCandidates[1].photo}
                        alt={displayCandidates[1].name}
                        fill
                        className="object-cover filter brightness-110"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Info del candidato */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    {displayCandidates[1].name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: displayCandidates[1].color }}
                      ></div>
                      <span className="text-sm font-medium text-white/90">
                        {displayCandidates[1].partyAbbr}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/70 px-2">
                      {displayCandidates[1].party}
                    </p>
                  </div>
                  
                  {/* Estadísticas */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-2xl font-black text-white mb-1">
                      {displayCandidates[1].percentage}%
                    </div>
                    <div className="text-xs text-white/60">
                      {formatNumber(displayCandidates[1].votes)} {t('secondRound.votes')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Link al resumen de la primera ronda */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-500 text-sm font-medium text-white/90 hover:text-white overflow-hidden"
            >
              {/* Efecto de fondo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Contenido del link */}
              <span className="relative z-10">{t('secondRound.first_round_summary')}</span>
              <span className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>

        </div>
      </div>
      
        {/* Sombra proyectada */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/20 rounded-full blur-xl"></div>
      </div>

      {/* Modal del resumen de la primera ronda */}
      <FirstRoundSummaryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SecondRoundBanner;