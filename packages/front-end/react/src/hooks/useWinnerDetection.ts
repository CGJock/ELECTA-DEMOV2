import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSocketData } from '../context/context';
import { mockParties } from '../data/mockData';

// Constante del padrón electoral de Bolivia
const PADRON_ELECTORAL = 7937138; // Total de personas empadronadas

// Tipos para la detección de ganador
export interface WinnerDetection {
  hasWinner: boolean;
  winner: {
    id: string;
    name: string;
    party: string;
    partyAbbr: string;
    photo: string;
    votes: number;
    percentage: number;
    color: string;
  } | null;
  runnerUp: {
    id: string;
    name: string;
    party: string;
    partyAbbr: string;
    photo: string;
    votes: number;
    percentage: number;
    color: string;
  } | null;
  winCondition: 'majority' | 'difference' | 'simple' | null;
  totalValidVotes: number;
  // Nuevos campos para información de participación
  participationPercentage: number;
  totalVotesEmitted: number;
  padronElectoral: number;
}

/**
 * Hook para detectar automáticamente cuando hay un ganador en las elecciones
 * 
 * Lógica de ganador:
 * - Primera vuelta: >50% votos válidos O ≥40% con diferencia ≥10 puntos
 *   ADEMÁS: Solo se declara ganador cuando se ha contado el 100% del padrón electoral
 * - Segunda vuelta: Mayoría simple (más votos válidos)
 * 
 * @returns WinnerDetection - Información completa sobre el ganador
 */
export const useWinnerDetection = (): WinnerDetection => {
  const { globalSummary } = useSocketData();
  const [mockDataVersion, setMockDataVersion] = useState(0);

  // Escuchar cambios en datos mock
  useEffect(() => {
    const handleMockDataChange = () => {
      setMockDataVersion(prev => prev + 1);
    };

    window.addEventListener('winnerDataChanged', handleMockDataChange);
    return () => window.removeEventListener('winnerDataChanged', handleMockDataChange);
  }, []);

  return useMemo(() => {
    // Leer datos mock directamente del objeto global
    const mockData = (window as any).mockWinnerData;
    
    // Usar datos mock si están disponibles, sino usar datos reales
    const dataToUse = mockData || globalSummary;
    
    // Calcular información de participación
    const totalVotesEmitted = dataToUse?.totalVotes || 0;
    const participationPercentage = (totalVotesEmitted / PADRON_ELECTORAL) * 100;
    
    // Si no hay datos, no hay ganador
    if (!dataToUse?.partyBreakdown) {
      return {
        hasWinner: false,
        winner: null,
        runnerUp: null,
        winCondition: null,
        totalValidVotes: 0,
        participationPercentage,
        totalVotesEmitted,
        padronElectoral: PADRON_ELECTORAL
      };
    }

    // Ordenar candidatos por votos (descendente)
    const sortedCandidates = [...dataToUse.partyBreakdown]
      .filter(party => party.count > 0) // Solo candidatos con votos
      .sort((a, b) => b.count - a.count);

    if (sortedCandidates.length === 0) {
      return {
        hasWinner: false,
        winner: null,
        runnerUp: null,
        winCondition: null,
        totalValidVotes: 0,
        participationPercentage,
        totalVotesEmitted,
        padronElectoral: PADRON_ELECTORAL
      };
    }

    const totalValidVotes = sortedCandidates.reduce((sum, candidate) => sum + candidate.count, 0);
    const firstPlace = sortedCandidates[0];
    const secondPlace = sortedCandidates[1];

    // Buscar datos del candidato en mockParties para obtener foto y color
    const findCandidateData = (partyName: string) => {
      return mockParties.find(party => 
        party.name.toLowerCase().includes(partyName.toLowerCase()) ||
        party.candidate.name.toLowerCase().includes(partyName.toLowerCase())
      );
    };

    const winnerPartyData = findCandidateData(firstPlace.name);
    
    // Datos del primer lugar
    const winnerData = {
      id: '1',
      name: winnerPartyData?.candidate.name || firstPlace.name,
      party: winnerPartyData?.name || firstPlace.name,
      partyAbbr: winnerPartyData?.abbreviation || firstPlace.abbr,
      photo: winnerPartyData?.candidate.photo || `/img/${firstPlace.name.replace(/\s+/g, '')}.png`,
      votes: firstPlace.count,
      percentage: firstPlace.percentage,
      color: winnerPartyData?.color || '#FF6B35'
    };

    // Datos del segundo lugar (si existe)
    const runnerUpData = secondPlace ? (() => {
      const runnerUpPartyData = findCandidateData(secondPlace.name);
      return {
        id: '2',
        name: runnerUpPartyData?.candidate.name || secondPlace.name,
        party: runnerUpPartyData?.name || secondPlace.name,
        partyAbbr: runnerUpPartyData?.abbreviation || secondPlace.abbr,
        photo: runnerUpPartyData?.candidate.photo || `/img/${secondPlace.name.replace(/\s+/g, '')}.png`,
        votes: secondPlace.count,
        percentage: secondPlace.percentage,
        color: runnerUpPartyData?.color || '#4A90E2'
      };
    })() : null;

    // LÓGICA DE DETECCIÓN DE GANADOR (fases eliminadas)
    // Declarar ganador solo si se ha contado el 100% del padrón
    if (participationPercentage >= 100) {
      // Condición 1: Más del 50% de votos válidos
      if (firstPlace.percentage > 50) {
        return {
          hasWinner: true,
          winner: winnerData,
          runnerUp: runnerUpData,
          winCondition: 'majority',
          totalValidVotes,
          participationPercentage,
          totalVotesEmitted,
          padronElectoral: PADRON_ELECTORAL
        };
      }

      // Condición 2: Al menos 40% Y diferencia ≥10 puntos con el segundo
      if (firstPlace.percentage >= 40 && secondPlace) {
        const difference = firstPlace.percentage - secondPlace.percentage;
        if (difference >= 10) {
          return {
            hasWinner: true,
            winner: winnerData,
            runnerUp: runnerUpData,
            winCondition: 'difference',
            totalValidVotes,
            participationPercentage,
            totalVotesEmitted,
            padronElectoral: PADRON_ELECTORAL
          };
        }
      }
    }

    // No hay ganador aún
    return {
      hasWinner: false,
      winner: null,
      runnerUp: null,
      winCondition: null,
      totalValidVotes,
      participationPercentage,
      totalVotesEmitted,
      padronElectoral: PADRON_ELECTORAL
    };
  }, [globalSummary, mockDataVersion]);
}; 