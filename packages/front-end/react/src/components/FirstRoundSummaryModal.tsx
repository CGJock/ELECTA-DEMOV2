"use client";
import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { mockParties } from '@data/mockData';
import { mockIncidents } from '@data/mockIncidents';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Resumen Primera Ronda</h2>
              <p className="text-blue-100">Elecciones Presidenciales - 17 de agosto 2025</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidatos para segunda ronda */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Candidatos para Segunda Ronda</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {firstRoundResults.slice(0, 2).map((candidate, index) => (
                <div key={candidate.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4">
                                          <div className="relative w-16 h-16">
                        <Image
                          src={candidate.photo}
                          alt={candidate.name}
                          fill
                          sizes="64px"
                          className="object-cover rounded-full"
                        />
                      </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.party}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: candidate.color }}
                        ></div>
                        <span className="text-sm font-medium">{candidate.partyAbbr}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{candidate.percentage}%</div>
                      <div className="text-sm text-gray-600">{formatNumber(candidate.votes)} votos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de resultados completos */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resultados Completos</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Candidato</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Partido</th>
                    <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">Votos</th>
                    <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {firstRoundResults.map((candidate, index) => (
                    <tr 
                      key={candidate.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                        candidate.disqualified ? 'opacity-50 bg-gray-100' : ''
                      }`}
                    >
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={candidate.photo}
                              alt={candidate.name}
                              fill
                              sizes="32px"
                              className={`object-cover rounded-full ${
                                candidate.disqualified ? 'grayscale' : ''
                              }`}
                            />
                          </div>
                          <div>
                            <span className={`font-medium ${candidate.disqualified ? 'text-gray-500' : 'text-gray-800'}`}>
                              {candidate.name}
                            </span>
                            {candidate.disqualified && (
                              <div className="text-xs text-red-600 font-medium">DESCALIFICADO</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              candidate.disqualified ? 'opacity-50' : ''
                            }`}
                            style={{ backgroundColor: candidate.color }}
                          ></div>
                          <span className={`text-sm ${candidate.disqualified ? 'text-gray-500' : 'text-gray-700'}`}>
                            {candidate.partyAbbr}
                          </span>
                        </div>
                      </td>
                      <td className={`border border-gray-200 px-4 py-3 text-right font-medium ${
                        candidate.disqualified ? 'text-gray-500' : 'text-gray-800'
                      }`}>
                        {formatNumber(candidate.votes)}
                      </td>
                      <td className={`border border-gray-200 px-4 py-3 text-right font-bold ${
                        candidate.disqualified ? 'text-gray-500' : 'text-gray-800'
                      }`}>
                        {candidate.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de incidentes */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de Incidentes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">Incidentes Reportados</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Total:</span>
                    <span className="font-bold text-red-800">{mockIncidents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Resueltos:</span>
                    <span className="font-bold text-green-600">
                      {mockIncidents.filter(i => i.status === 'resolved').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Pendientes:</span>
                    <span className="font-bold text-orange-600">
                      {mockIncidents.filter(i => i.status === 'new').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Atascados:</span>
                    <span className="font-bold text-red-600">
                      {mockIncidents.filter(i => i.status === 'stuck').length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">Estadísticas Generales</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Total de votos:</span>
                    <span className="font-bold text-blue-800">{formatNumber(6300000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Participación:</span>
                    <span className="font-bold text-blue-800">78.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Mesas habilitadas:</span>
                    <span className="font-bold text-blue-800">45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Departamentos:</span>
                    <span className="font-bold text-blue-800">9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de incidentes principales */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Incidentes Principales</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockIncidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{incident.title.es}</h4>
                      <p className="text-sm text-gray-600 mt-1">{incident.description.es}</p>
                      <p className="text-xs text-gray-500 mt-1">{incident.location.es}</p>
                    </div>
                    <div className="ml-4">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
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

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Segunda ronda programada para el 20 de octubre de 2025
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstRoundSummaryModal; 