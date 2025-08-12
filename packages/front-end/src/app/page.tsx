'use client'
import React from 'react';
import dynamic from 'next/dynamic';

// Componentes
import { Suspense } from 'react';
// import GlobalCounter from '../components/GlobalCounter';
const GlobalCounter = dynamic(() => import('@components/GlobalCounter'), { ssr: false });
const Map2 = dynamic(() => import('@components/Map'), { ssr: false });
import StatsContainer from '@components/StatsContainer';
import { IncidentsFlag } from '@components/IncidentsFlag';

export default function Page() {

return (
  
    
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
            <GlobalCounter />
          </div>

          {/* Separator */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%)',
            margin: '1.5rem 0', // Increased margin
            borderRadius: '1px'
          }} />

          {/* Map and Stats Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr', // mitad y mitad, puedes hacer 1fr 1.2fr si quieres
            gap: '1rem',
            alignItems: 'start',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            padding: '1rem',
          }}>
            {/* Map Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}>
              <Map />
            </div>

            {/* Stats Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              height: '100%', // Ensure it takes full height
              marginLeft: '0 auto',
            }}>
              <div style={{ marginTop: '14px', width: '100%' }}>
                <StatsContainer />
              </div>
            </div>
          </div>
        </div>
        <IncidentsFlag />
      </div>
      </Suspense>
      
    
    
  );
}
