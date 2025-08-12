"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { mockParties } from '@data/mockData';
import { mockIncidents } from '@data/mockIncidents';
import { X, TrendingUp, AlertTriangle, Users, MapPin, Calendar } from 'lucide-react';

interface FirstRoundSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FirstRoundSummaryModal: React.FC<FirstRoundSummaryModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();

  // Datos mock para la primera ronda (simulando resultados reales)
  const firstRoundResults = [
    {
      id: '10',
      name: 'Samuel Doria Medina',
      party: 'Frente de Unidad Nacional',
      partyAbbr: 'UN',
      photo: '/img/SamuelDoriaMedina.BloqueDeUnidad.png',
      votes: 2847592,
      percentage: 45.2,
      color: '#1ABC9C',
      disqualified: false
    },
    {
      id: '4',
      name: 'Jorge Tuto Quiroga',
      party: 'Alianza LIBRE',
      partyAbbr: 'LIBRE',
      photo: '/img/JorgeTutoQuiroga.AlianzaLIBRE.png',
      votes: 2650234,
      percentage: 42.1,
      color: '#FFD700',
      disqualified: false
    },
    {
      id: '1',
      name: 'Eduardo Castillo',
      party: 'MAS-IPSP',
      partyAbbr: 'MAS',
      photo: '/img/EduardoCastillo.MAS-IPSP.png',
      votes: 1250000,
      percentage: 19.8,
      color: '#FF6B35',
      disqualified: false
    },
    {
      id: '3',
      name: 'Manfred Reyes Villa',
      party: 'Autonomía para Bolivia - Súmate',
      partyAbbr: 'APB Súmate',
      photo: '/img/ManfredReyesVilla.AlianzaABPSumate.png',
      votes: 850000,
      percentage: 13.5,
      color: '#50C878',
      disqualified: false
    },
    {
      id: '5',
      name: 'Rodrigo Paz Pereira',
      party: 'Partido Demócrata Cristiano',
      partyAbbr: 'PDC',
      photo: '/img/RodrigoPazPereira.PDC.png',
      votes: 650000,
      percentage: 10.3,
      color: '#8B4513',
      disqualified: false
    },
    {
      id: '6',
      name: 'Pavel Aracena',
      party: 'Acción Democrática Nacionalista',
      partyAbbr: 'LYP-ADN',
      photo: '/img/PavelAracena.LYP-ADN.png',
      votes: 520000,
      percentage: 8.3,
      color: '#DC2626',
      disqualified: false
    },
    {
      id: '7',
      name: 'Jaime Dunn',
      party: 'Nueva Generación Patriótica',
      partyAbbr: 'NGP',
      photo: '/img/JaimeDunn.NGP.png',
      votes: 380000,
      percentage: 6.0,
      color: '#F43F5E',
      disqualified: true
    },
    {
      id: '8',
      name: 'Max Jhonny Fernández Saucedo',
      party: 'La Fuerza del Pueblo',
      partyAbbr: 'FP',
      photo: '/img/JhonnyFernandez.FP.png',
      votes: 320000,
      percentage: 5.1,
      color: '#9B59B6',
      disqualified: false
    },
    {
      id: '9',
      name: 'Mónica Eva Copa Murga',
      party: 'Movimiento de Renovación Nacional',
      partyAbbr: 'MORENA',
      photo: '/img/EvaCopa.Morena.png',
      votes: 280000,
      percentage: 4.4,
      color: '#E67E22',
      disqualified: false
    },
    {
      id: '2',
      name: 'Andrónico Rodríguez',
      party: 'Alianza Popular',
      partyAbbr: 'AP',
      photo: '/img/AndrónicoRodríguez.AlianzaPopular.png',
      votes: 250000,
      percentage: 4.0,
      color: '#4A90E2',
      disqualified: false
    }
  ];

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-BO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10B981';
      case 'stuck': return '#EF4444';
      case 'new': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resuelto';
      case 'stuck': return 'Atascado';
      case 'new': return 'Nuevo';
      default: return 'Desconocido';
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Contenedor principal con glassmorphism */}
      <div className="relative max-w-6xl w-full h-[90vh] flex flex-col rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        
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

        <div className="relative z-10 h-full flex flex-col">
          {/* Header elegante */}
          <div className="relative p-8 md:p-12 border-b border-white/10 flex-shrink-0">
            {/* Efecto de gradiente en el header */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-600/20"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-white/60"></div>
                    <div className="px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                      <span className="text-white/90 text-sm font-medium tracking-wider uppercase">
                        Bolivia 2025
                      </span>
                    </div>
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-white/60"></div>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-2 tracking-tight">
                    PRIMERA RONDA
                  </h1>
                  <p className="text-white/70 text-lg font-light">
                    Elección Presidencial - 17 de agosto 2025
                  </p>
                </div>
                
                {/* Botón de cerrar */}
                <button
                  onClick={onClose}
                  className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/20 hover:scale-110 flex-shrink-0 ml-4"
                >
                  <X className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8">
            
            {/* Candidatos para segunda ronda */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                  Candidatos para Segunda Ronda
                </h2>
                <p className="text-white/60 text-sm">Los dos candidatos con mayor votación</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {firstRoundResults.slice(0, 2).map((candidate, index) => (
                  <div key={candidate.id} className="group relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center space-x-4">
                        {/* Foto del candidato */}
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                          <div className="absolute inset-2 rounded-full overflow-hidden">
                            <Image
                              src={candidate.photo}
                              alt={candidate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                          <p className="text-sm text-white/70 mb-2">{candidate.party}</p>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: candidate.color }}
                            ></div>
                            <span className="text-sm font-medium text-white/90">{candidate.partyAbbr}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-3xl font-black text-white mb-1">{candidate.percentage}%</div>
                          <div className="text-sm text-white/60">{formatNumber(candidate.votes)} votos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resultados completos */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                  Resultados Completos
                </h2>
                <p className="text-white/60 text-sm">Todos los candidatos y sus resultados</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/10 border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Candidato</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Partido</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Votos</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstRoundResults.map((candidate, index) => (
                        <tr 
                          key={candidate.id} 
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            candidate.disqualified ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={candidate.photo}
                                  alt={candidate.name}
                                  fill
                                  className={`object-cover rounded-full ${
                                    candidate.disqualified ? 'grayscale' : ''
                                  }`}
                                />
                              </div>
                              <div>
                                <span className={`font-medium ${candidate.disqualified ? 'text-white/50' : 'text-white'}`}>
                                  {candidate.name}
                                </span>
                                {candidate.disqualified && (
                                  <div className="text-xs text-red-400 font-medium">DESCALIFICADO</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  candidate.disqualified ? 'opacity-50' : ''
                                }`}
                                style={{ backgroundColor: candidate.color }}
                              ></div>
                              <span className={`text-sm ${candidate.disqualified ? 'text-white/50' : 'text-white/90'}`}>
                                {candidate.partyAbbr}
                              </span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-right font-medium ${
                            candidate.disqualified ? 'text-white/50' : 'text-white'
                          }`}>
                            {formatNumber(candidate.votes)}
                          </td>
                          <td className={`px-6 py-4 text-right font-bold ${
                            candidate.disqualified ? 'text-white/50' : 'text-white'
                          }`}>
                            {candidate.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Estadísticas y incidentes */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resumen de incidentes */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                    Resumen de Incidentes
                  </h3>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-white font-medium">Total Incidentes</span>
                    </div>
                    <span className="text-2xl font-bold text-red-400">{mockIncidents.length}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-lg font-bold text-green-400">
                        {mockIncidents.filter(i => i.status === 'resolved').length}
                      </div>
                      <div className="text-xs text-white/70">Resueltos</div>
                    </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="text-lg font-bold text-orange-400">
                        {mockIncidents.filter(i => i.status === 'new').length}
                      </div>
                      <div className="text-xs text-white/70">Pendientes</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-lg font-bold text-red-400">
                        {mockIncidents.filter(i => i.status === 'stuck').length}
                      </div>
                      <div className="text-xs text-white/70">Atascados</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas generales */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                    Estadísticas Generales
                  </h3>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Total de Votos</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-400">{formatNumber(6300000)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-lg font-bold text-blue-400">78.5%</div>
                      <div className="text-xs text-white/70">Participación</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-lg font-bold text-blue-400">45,230</div>
                      <div className="text-xs text-white/70">Mesas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incidentes principales */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
                  Incidentes Principales
                </h3>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {mockIncidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{incident.title.es}</h4>
                          <p className="text-sm text-white/70 mb-2">{incident.description.es}</p>
                          <div className="flex items-center space-x-2 text-xs text-white/50">
                            <MapPin className="w-3 h-3" />
                            <span>{incident.location.es}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span 
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: getStatusColor(incident.status) + '20',
                              color: getStatusColor(incident.status)
                            }}
                          >
                            {getStatusText(incident.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative p-8 border-t border-white/10 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Segunda ronda programada para el 20 de octubre de 2025</span>
              </div>
              <button
                onClick={onClose}
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-500 text-sm font-medium text-white/90 hover:text-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstRoundSummaryModal; 