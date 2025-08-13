'use client'
import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface WinnerBannerProps {
  isVisible: boolean;
  winner?: {
    name: string;
    party: string;
    percentage: number;
    votes: number;
    photo?: string;
  };
  type?: 'first-round-majority' | 'first-round-difference' | 'second-round';
}

const WinnerBanner: React.FC<WinnerBannerProps> = ({ 
  isVisible, 
  winner,
  type = 'second-round'
}) => {
  const { t } = useTranslation();

  if (!isVisible || !winner) return null;

  const getBannerTitle = () => {
    switch (type) {
      case 'first-round-majority':
      case 'first-round-difference':
        return 'GANADOR';
      case 'second-round':
        return 'PRESIDENTE ELECTO';
      default:
        return 'GANADOR';
    }
  };

  const getBannerSubtitle = () => {
    switch (type) {
      case 'first-round-majority':
        return 'Candidato elegido con mayoría absoluta';
      case 'first-round-difference':
        return 'Candidato elegido con 40% de votos y 10 puntos de diferencia';
      case 'second-round':
        return 'Presidente electo de Bolivia';
      default:
        return 'Ganador de las elecciones';
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-BO');
  };

  return (
    <div className="relative w-full mb-8" data-winner-banner>
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
                  {type === 'second-round' ? 'Segunda Ronda Bolivia 2025' : 'Bolivia 2025'}
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-white/60"></div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-2 tracking-tight">
              {getBannerTitle()}
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-light mb-2">
              {getBannerSubtitle()}
            </p>
            <p className="text-white/60 text-base font-medium">
              Resultados oficiales del Tribunal Supremo Electoral
            </p>
          </div>

          {/* Sección del ganador */}
          <div className="flex justify-center">
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 max-w-2xl">
                {/* Foto del ganador */}
                <div className="relative mx-auto mb-8">
                  <div className="relative w-48 h-48 mx-auto">
                    {/* Anillo animado */}
                    <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-400 to-indigo-400 animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border-2 animate-reverse-spin border-blue-400"></div>
                    
                    {/* Imagen */}
                    <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-white/20">
                      <Image
                        src={winner.photo || '/img/default-candidate.svg'}
                        alt={winner.name}
                        fill
                        className="object-cover filter brightness-110"
                        onError={(e) => {
                          // Fallback a imagen por defecto si no carga
                          (e.target as HTMLImageElement).src = '/img/default-candidate.svg';
                        }}
                      />
                    </div>
                    
                    {/* Checkmark de ganador */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-4 border-slate-900 shadow-2xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">✓</span>
                    </div>
                  </div>
                </div>
                
                {/* Info del ganador */}
                <div className="text-center space-y-4">
                  <h3 className="text-3xl md:text-4xl font-black text-white">
                    {winner.name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-lg font-bold text-white/90">
                        {winner.party}
                      </span>
                    </div>
                  </div>
                  
                  {/* Estadísticas */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-black text-white mb-1">
                          {winner.percentage}%
                        </div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">
                          Porcentaje
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-black text-white mb-1">
                          {formatNumber(winner.votes)}
                        </div>
                        <div className="text-sm text-white/60 uppercase tracking-wider">
                          Votos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sombra proyectada */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default WinnerBanner; 