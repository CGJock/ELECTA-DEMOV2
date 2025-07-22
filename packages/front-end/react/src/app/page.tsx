'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import emailjs from '@emailjs/browser';
import { mockIncidents } from '@data/mockIncidents';
import IncidentForm from '@components/IncidentForm';
import { IncidentsFlag } from '@components/IncidentsFlag';
import type { Incident } from '@/types/election';

// Componentes
import { Suspense } from 'react';
// import GlobalCounter from '@components/GlobalCounter';
const GlobalCounter = dynamic(() => import('@components/GlobalCounter'), { ssr: false });
const FullscreenWrapper = dynamic(() => import('@components/FullscreenWrapper'), { ssr: false });
const Map2 = dynamic(() => import('@components/Map'), { ssr: false });

import StatsContainer from '@components/StatsContainer';
import FooterWrapper from '@components/components-wrappers/FooterWrapper';
import ElectionReportTable from '@components/ElectionReportTable';
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



export default function Page() {
  // Estado para los incidentes
  const [incidents, setIncidents] = useState(mockIncidents);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'map' | 'stats'>('map');

  // Función para agregar un incidente
  const handleAddIncident = (incidentData: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setIncidents((prev) => [...prev, newIncident]);
  };

  return (
    <>
      {/* Panel de incidentes */}
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


          {/* Global Counter Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem' // Increased margin
          }}>
            <FullscreenWrapper>
              <GlobalCounter />
            </FullscreenWrapper>
          </div>

          {/* Separator */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%)',
            margin: '1.5rem 0', // Increased margin
            borderRadius: '1px'
          }} />

          {/* Map and Stats Section */}
          {/* Responsive: Tabs en mobile, grid en desktop */}
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
        </div>
        <IncidentsFlag />
        {/* Línea divisoria moderna */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)',
          margin: '2.5rem 0 2rem 0',
          borderRadius: '2px',
          width: '100%',
          maxWidth: '900px',
          alignSelf: 'center',
        }} />

        
        {/* Línea divisoria moderna */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #818cf8 50%, transparent 100%)',
          margin: '3rem 0 2rem 0',
          borderRadius: '2px',
          width: '100%',
          maxWidth: '900px',
          alignSelf: 'center',
        }} />
        
        {/* ElectionReportTable - Vista de tabla */}
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <ElectionReportTable />
        </div>
      </div>
      </Suspense>
      {/* Footer con el formulario de incidentes oculto en modal */}
      <FooterWrapper onAddIncident={handleAddIncident} />
    </>
  );
}
