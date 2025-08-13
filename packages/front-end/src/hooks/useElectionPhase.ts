import { useState, useEffect } from 'react';

export interface ElectionPhase {
  isSecondRound: boolean;
  isPostFirstRound: boolean;
}

export const useElectionPhase = (): ElectionPhase => {
  const [electionPhase, setElectionPhase] = useState<ElectionPhase>({
    isSecondRound: false,
    isPostFirstRound: false
  });

  useEffect(() => {
    const checkElectionPhase = () => {
      const now = new Date();
      const secondRoundDate = new Date('2025-10-20T00:00:00');
      const firstRoundDate = new Date('2025-08-17T00:00:00');

      if (now >= secondRoundDate) {
        setElectionPhase({ isSecondRound: true, isPostFirstRound: false });
      } else if (now >= firstRoundDate) {
        setElectionPhase({ isSecondRound: false, isPostFirstRound: true });
      } else {
        setElectionPhase({ isSecondRound: false, isPostFirstRound: false });
      }
    };

    // Verificar inmediatamente
    checkElectionPhase();
    // Nota: sin intervalos ni eventos forzados; actualización solo en montaje
  }, []);

  return electionPhase;
};