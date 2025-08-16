'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { mockIncidents } from '@data/mockIncidents';
import IncidentForm from '@components/IncidentForm';
import { IncidentsFlag } from '@components/IncidentsFlag';
import type { Incident } from '@/types/election';

import WinnerBanner from '@/components/WinnerBanner';

// Componentes
import { Suspense } from 'react';
// import GlobalCounter from '@components/GlobalCounter';
const GlobalCounter = dynamic(() => import('@components/GlobalCounter'), { ssr: false });
const Map2 = dynamic(() => import('@components/Map'), { ssr: false });

import StatsContainer from '@components/StatsContainer';
import FooterWrapper from '@components/components-wrappers/FooterWrapper';
// import ElectionReportTable from '@components/ElectionReportTable';
// Eliminar la importación de Footer
// import Footer from '@components/Footer';
import { useEffect } from 'react';
// Hook para detectar si es móvil
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

// Hook para obtener datos del ganador
function useWinnerData() {
  const [winnerData, setWinnerData] = useState<any>(null);

  useEffect(() => {
    const handleWinnerDataChange = () => {
      const mockData = (window as any).mockWinnerData;
      setWinnerData(mockData);
    };

    // Verificar datos iniciales
    handleWinnerDataChange();

    // Escuchar cambios
    window.addEventListener('winnerDataChanged', handleWinnerDataChange);
    return () => window.removeEventListener('winnerDataChanged', handleWinnerDataChange);
  }, []);

  return winnerData;
}

export default function Page() {
  // Estado para los incidentes
  const [incidents, setIncidents] = useState(mockIncidents);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'map' | 'stats'>('map');
  const winnerData = useWinnerData();

  // Función para agregar un incidente
  const handleAddIncident = (incidentData: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setIncidents((prev) => [...prev, newIncident]);
  };

  // Determinar si hay un ganador y qué tipo
  const hasWinner = winnerData && winnerData.partyBreakdown && winnerData.partyBreakdown.length > 0;
  const winner = hasWinner ? {
    name: winnerData.partyBreakdown[0].name,
    party: winnerData.partyBreakdown[0].abbr,
    percentage: winnerData.partyBreakdown[0].percentage,
    votes: winnerData.partyBreakdown[0].count,
    photo: `/img/${winnerData.partyBreakdown[0].abbr}.png`
  } : undefined;

  // Determinar el tipo de ganador (fases eliminadas)
  const getWinnerType = () => {
    if (!winner) return 'second-round';
    
    // Si los datos tienen un winnerType explícito, usarlo
    if (winnerData && winnerData.winnerType) {
      return winnerData.winnerType;
    }
    
    // Por defecto
    return 'second-round';
  };

  return (
    <>
      {/* Panel de incidentes - Siempre visible (fases eliminadas) */}
      <IncidentsFlag incidents={incidents} />

      <Suspense fallback={<div>Loading translations...</div>}>
      <div style={{
        flex: 1, // Allow this container to grow
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        maxWidth: '1600px'
      }}>
        {/* Main Content */}
        <div style={{
          flex: 1, // Allow main content to grow
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem 2rem',
          justifyContent: 'center'
        }}>

          {/* Winner Banner - Mostrar si hay ganador */}
          {hasWinner && (
            <WinnerBanner 
              isVisible={true} 
              winner={winner} 
              type={getWinnerType()}
            />
          )}

          {/* Contenido principal (fases eliminadas) */}
          {!hasWinner && (
            <>
              {/* Global Counter Section */}
              <div style={{
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                padding: '0 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                {/* Espacio a la izquierda para mantener el centro */}
                <div style={{ flex: '1' }}></div>
                {/* GlobalCounter centrado */}
                <div style={{
                  flex: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: 'translateX(55px)' // Mover 55px hacia la derecha (70px - 15px = 55px)
                }}>
                  <GlobalCounter />
                </div>
                {/* Espacio a la derecha para mantener el centro */}
                <div style={{ flex: '1' }}></div>
              </div>

              {/* Separator */}
              <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%)',
                margin: '1.5rem 0',
                borderRadius: '1px'
              }} />

              {/* Map and Stats Section */}
              {isMobile ? (
                <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', background: 'rgba(30,41,59,0.7)', borderRadius: 16, boxShadow: '0 4px 24px rgba(16,185,129,0.08)', padding: '0.5rem 0.5rem 1.5rem 0.5rem', marginBottom: 24 }}>
                  {/* Tabs */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, borderRadius: 12, overflow: 'hidden', marginBottom: 18, background: 'rgba(15,23,42,0.7)', border: '1px solid #374151' }}>
                    <button
                      onClick={() => setActiveTab('map')}
                      style={{
                        flex: 1,
                        padding: '0.7rem 0',
                        background: activeTab === 'map' ? 'rgba(16,185,129,0.13)' : 'transparent',
                        color: activeTab === 'map' ? '#10B981' : '#cbd5e1',
                        fontWeight: 700,
                        fontSize: '1.08rem',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Mapa
                    </button>
                    <button
                      onClick={() => setActiveTab('stats')}
                      style={{
                        flex: 1,
                        padding: '0.7rem 0',
                        background: activeTab === 'stats' ? 'rgba(16,185,129,0.13)' : 'transparent',
                        color: activeTab === 'stats' ? '#10B981' : '#cbd5e1',
                        fontWeight: 700,
                        fontSize: '1.08rem',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Resultados
                    </button>
                  </div>
                  <div style={{ minHeight: 420 }}>
                    {activeTab === 'map' && (
                      <div style={{ width: '100%', minHeight: 420 }}>
                        <Map2 incidents={incidents} />
                      </div>
                    )}
                    {activeTab === 'stats' && (
                      <div style={{ width: '100%', minHeight: 420 }}>
                        <StatsContainer />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  alignItems: 'start',
                  justifyItems: 'center',
                  maxWidth: '1400px',
                  width: '100%',
                  margin: '0 auto',
                  padding: '1rem',
                }}>
                  {/* Map Section */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    width: 'calc(100% - 120px)',
                    minHeight: '450px',
                    marginTop: '70px',
                  }}>
                    <Map2 incidents={incidents} />
                  </div>

                  {/* Stats Section */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    width: 'calc(100% - 50px)',
                    minHeight: '450px',
                  }}>
                    <div style={{ width: '100%' }}>
                      <StatsContainer />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        
        {!hasWinner && (
          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #818cf8 50%, transparent 100%)',
            margin: '3rem 0 2rem 0',
            borderRadius: '2px',
            width: '100%',
            maxWidth: '900px',
            alignSelf: 'center',
          }} />
        )}
        
        {/* ElectionReportTable (fases eliminadas) */}
        {!hasWinner && (
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            {/* <ElectionReportTable /> */}
          </div>
        )}

        {/* Second Round Banner al final (conservado) */}
        {/* {!hasWinner && (
          <div 
            data-second-round-banner
            style={{ 
              width: '100%', 
              maxWidth: '900px', 
              margin: '2rem auto 0 auto', 
              padding: '0 1rem' 
            }}
          >
            
          </div>
        )} */}
      </div>
      </Suspense>
      
      {/* Footer con el formulario de incidentes oculto en modal - Siempre visible */}
      <FooterWrapper onAddIncident={handleAddIncident} />
      
      {/* Election Phase Debugger eliminado */}
    </>
  );
}
