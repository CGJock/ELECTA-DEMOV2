import { useState, useEffect } from 'react';

export interface ElectionPhase {
  isSecondRound: boolean;
  isPostFirstRound: boolean;
  isPostSecondRound: boolean;
  isPreElection: boolean;
  currentPhase: 'pre-election' | 'post-first-round' | 'second-round' | 'post-second-round';
}

// Variable global para forzar fases en desarrollo
let forcedPhase: 'pre-election' | 'post-first-round' | 'second-round' | 'post-second-round' | null = null;

export const useElectionPhase = (): ElectionPhase => {
  const [electionPhase, setElectionPhase] = useState<ElectionPhase>({
    isSecondRound: false,
    isPostFirstRound: false,
    isPostSecondRound: false,
    isPreElection: true,
    currentPhase: 'pre-election'
  });

  useEffect(() => {
    const checkElectionPhase = () => {
      // Si hay una fase forzada en desarrollo, usarla
      if (process.env.NODE_ENV === 'development' && forcedPhase) {
        const phase = forcedPhase;
        setElectionPhase({
          isSecondRound: phase === 'second-round',
          isPostFirstRound: phase === 'post-first-round',
          isPostSecondRound: phase === 'post-second-round',
          isPreElection: phase === 'pre-election',
          currentPhase: phase
        });
        return;
      }

      const now = new Date();
      const secondRoundEndDate = new Date('2025-10-21T00:00:00'); // Un día después de la segunda vuelta
      const secondRoundDate = new Date('2025-10-20T00:00:00'); // Fecha de segunda vuelta
      const firstRoundDate = new Date('2025-08-17T00:00:00'); // Fecha de primera vuelta

      if (now >= secondRoundEndDate) {
        setElectionPhase({
          isSecondRound: false,
          isPostFirstRound: false,
          isPostSecondRound: true,
          isPreElection: false,
          currentPhase: 'post-second-round'
        });
      } else if (now >= secondRoundDate) {
        setElectionPhase({
          isSecondRound: true,
          isPostFirstRound: false,
          isPostSecondRound: false,
          isPreElection: false,
          currentPhase: 'second-round'
        });
      } else if (now >= firstRoundDate) {
        setElectionPhase({
          isSecondRound: false,
          isPostFirstRound: true,
          isPostSecondRound: false,
          isPreElection: false,
          currentPhase: 'post-first-round'
        });
      } else {
        setElectionPhase({
          isSecondRound: false,
          isPostFirstRound: false,
          isPostSecondRound: false,
          isPreElection: true,
          currentPhase: 'pre-election'
        });
      }
    };

    // Verificar inmediatamente
    checkElectionPhase();

    // Verificar cada minuto para cambios automáticos
    const interval = setInterval(checkElectionPhase, 60000);

    // Escuchar eventos de cambio de fase forzados
    const handlePhaseChange = () => {
      checkElectionPhase();
    };

    window.addEventListener('electionPhaseChanged', handlePhaseChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('electionPhaseChanged', handlePhaseChange);
    };
  }, []);

  return electionPhase;
};

// Función para forzar fases en desarrollo
export const forceElectionPhase = (phase: 'pre-election' | 'post-first-round' | 'second-round' | 'post-second-round' | null) => {
  if (process.env.NODE_ENV === 'development') {
    forcedPhase = phase;
    // Disparar un evento personalizado para que los componentes se actualicen
    window.dispatchEvent(new CustomEvent('electionPhaseChanged'));
  }
}; 