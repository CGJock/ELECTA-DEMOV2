'use client'
import React, { useState, useEffect } from 'react';
import { useElectionPhase, forceElectionPhase } from '@/hooks/useElectionPhase';

// Variable global para simular datos de ganador
let mockWinnerData: any = null;

// Exponer la variable global para que el hook pueda acceder
if (typeof window !== 'undefined') {
  (window as any).mockWinnerData = mockWinnerData;
}

// Función para simular datos de ganador
export const simulateWinnerData = (type: 'first-round-majority' | 'first-round-difference' | 'second-round' | null) => {
  if (!type) {
    mockWinnerData = null;
    if (typeof window !== 'undefined') {
      (window as any).mockWinnerData = null;
    }
    // Disparar evento para limpiar el banner
    window.dispatchEvent(new CustomEvent('winnerDataChanged'));
    return;
  }

  const baseData = {
    totalVotes: 3000000,
    partyBreakdown: [],
    winnerType: type // Agregar el tipo al objeto
  };

  switch (type) {
    case 'first-round-majority':
      mockWinnerData = {
        ...baseData,
        partyBreakdown: [
          {
            name: 'MAS-IPSP',
            abbr: 'MAS',
            count: 1600000,
            percentage: 53.3
          },
          {
            name: 'Alianza Popular',
            abbr: 'AP',
            count: 1200000,
            percentage: 40.0
          }
        ]
      };
      break;
    
    case 'first-round-difference':
      mockWinnerData = {
        ...baseData,
        partyBreakdown: [
          {
            name: 'MAS-IPSP',
            abbr: 'MAS',
            count: 1300000,
            percentage: 43.3
          },
          {
            name: 'Alianza Popular',
            abbr: 'AP',
            count: 900000,
            percentage: 30.0
          }
        ]
      };
      break;
    
    case 'second-round':
      mockWinnerData = {
        ...baseData,
        partyBreakdown: [
          {
            name: 'MAS-IPSP',
            abbr: 'MAS',
            count: 1600000,
            percentage: 53.3
          },
          {
            name: 'Alianza Popular',
            abbr: 'AP',
            count: 1400000,
            percentage: 46.7
          }
        ]
      };
      break;
  }

  // Actualizar la variable global
  if (typeof window !== 'undefined') {
    (window as any).mockWinnerData = mockWinnerData;
  }

  // Disparar evento para actualizar el contexto
  window.dispatchEvent(new CustomEvent('winnerDataChanged'));
};

const ElectionPhaseDebugger: React.FC = () => {
  const { isSecondRound, isPostFirstRound, isPostSecondRound, isPreElection, currentPhase } = useElectionPhase();
  const [showDebugger, setShowDebugger] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    console.log('[ElectionPhaseDebugger] Not in development mode, returning null');
    return null;
  }

  // Escuchar cambios de fase forzados
  useEffect(() => {
    const handlePhaseChange = () => {
      setForceRefresh(prev => prev + 1);
    };

    window.addEventListener('electionPhaseChanged', handlePhaseChange);
    return () => window.removeEventListener('electionPhaseChanged', handlePhaseChange);
  }, []);

  const handleForcePhase = (phase: 'pre-election' | 'post-first-round' | 'second-round' | 'post-second-round' | null) => {
    forceElectionPhase(phase);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '320px',
      border: '1px solid #333',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong>🔧 Election Phase Debugger</strong>
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showDebugger ? '−' : '+'}
        </button>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '8px' }}>
        NODE_ENV: {process.env.NODE_ENV || 'undefined'}
      </div>
      
      {showDebugger && (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Current Phase:</strong> {currentPhase}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div><strong>Pre-Election:</strong> {isPreElection ? '✅' : '❌'}</div>
            <div><strong>Post First Round:</strong> {isPostFirstRound ? '✅' : '❌'}</div>
            <div><strong>Second Round:</strong> {isSecondRound ? '✅' : '❌'}</div>
            <div><strong>Post Second Round:</strong> {isPostSecondRound ? '✅' : '❌'}</div>
          </div>
          
          <div style={{ marginTop: '12px', marginBottom: '8px' }}>
            <strong>Force Phase:</strong>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleForcePhase('pre-election')}
              style={{
                background: currentPhase === 'pre-election' ? '#10B981' : '#374151',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Pre-Election
            </button>
            <button
              onClick={() => handleForcePhase('post-first-round')}
              style={{
                background: currentPhase === 'post-first-round' ? '#10B981' : '#374151',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Post First Round
            </button>
            <button
              onClick={() => handleForcePhase('second-round')}
              style={{
                background: currentPhase === 'second-round' ? '#10B981' : '#374151',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Second Round
            </button>
            <button
              onClick={() => handleForcePhase('post-second-round')}
              style={{
                background: currentPhase === 'post-second-round' ? '#10B981' : '#374151',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Post Second Round
            </button>
            <button
              onClick={() => handleForcePhase(null)}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>

          {/* Sección de prueba del WinnerBanner */}
          <div style={{ marginTop: '12px', marginBottom: '8px' }}>
            <strong>🏆 Test WinnerBanner:</strong>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                handleForcePhase('post-first-round');
                simulateWinnerData('first-round-majority');
              }}
              style={{
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              First Round Winner (&gt;50%)
            </button>
            <button
              onClick={() => {
                handleForcePhase('post-first-round');
                simulateWinnerData('first-round-difference');
              }}
              style={{
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              First Round Winner (40%+10pts)
            </button>
            <button
              onClick={() => {
                handleForcePhase('second-round');
                simulateWinnerData('second-round');
              }}
              style={{
                background: '#EC4899',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Second Round Winner
            </button>
            <button
              onClick={() => {
                handleForcePhase('post-second-round');
                simulateWinnerData('second-round');
              }}
              style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Post Second Round Winner
            </button>
            <button
              onClick={() => {
                simulateWinnerData(null);
              }}
              style={{
                background: '#6B7280',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Clear Winner
            </button>
          </div>
          
          <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.8 }}>
            <div>First Round: Aug 17, 2025</div>
            <div>Second Round: Oct 20, 2025</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionPhaseDebugger; 