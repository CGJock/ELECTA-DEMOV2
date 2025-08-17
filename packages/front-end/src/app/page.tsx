'use client'
import React from 'react';
import Header from '@/components/Header';
import UncomingElectionBanner from '@/components/UncomingElectionBanner';
import GlobalCounter from '@/components/GlobalCounter';
import Map from '@/components/Map';
import StatsContainer from '@/components/StatsContainer';
import { IncidentsFlag } from '@/components/IncidentsFlag';
import Footer from '@/components/Footer';
import WinnerBanner from '@/components/WinnerBanner';
// import SecondRoundBanner from '@/components/SecondRoundBanner';
// import ElectionReportTable from '@/components/ElectionReportTable';
import VisibilityWrapper from '@components/VisibilityWrapper';
import ComponentVisibilityProvider from '@/context/componentVisibilityContext';

// ===== CÓDIGO DE DEVELOPER (COMENTADO) =====

// ===========================================

// Componentes
// import { Suspense } from 'react';
// import GlobalCounter from '../components/GlobalCounter';
// const GlobalCounter = dynamic(() => import('@components/GlobalCounter') as any, { ssr: false });
// const Map2 = dynamic(() => import('@components/Map') as any, { ssr: false });
// import StatsContainer from '@components/StatsContainer';
// import { IncidentsFlag } from '@components/IncidentsFlag';
// import { ElectionForm } from '@/components/ADMIN-components/createElection';
// import { ActiveElectionSelector } from '@/components/ADMIN-components/setActiveElection';
// import { ActiveElectionDisplay } from '@/components/activeElectionRead';
// import HeaderWrapper from '@components/components-wrappers/HeaderWrapper';
// import FooterWrapper from '@components/components-wrappers/FooterWrapper';



export default function Home() {
  return (
    <ComponentVisibilityProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <VisibilityWrapper componentName="Header">
          <Header />
        </VisibilityWrapper>

        {/* Banner de próximas elecciones */}
        <UncomingElectionBanner />

        {/* Global Counter */}
        <VisibilityWrapper componentName="GlobalCounter">
          <GlobalCounter />
        </VisibilityWrapper>

 

        <div className="container mx-auto px-4 py-8">
          {/* Map Section */}
          <VisibilityWrapper componentName="Map">
            <div className="mb-8">
              <Map incidents={[]} />
            </div>
          </VisibilityWrapper>

          {/* Stats Section */}
          <VisibilityWrapper componentName="StatsContainer">
            <StatsContainer />
          </VisibilityWrapper>


          {/* Election Report Table */}
          {/* <VisibilityWrapper componentName="ElectionReportTable">
            <ElectionReportTable />
          </VisibilityWrapper> */}

          {/* Incidents Flag */}
          {/* <VisibilityWrapper componentName="IncidentsFlag">
            <IncidentsFlag />
          </VisibilityWrapper> */}

          {/* Winner Banner */}
          <VisibilityWrapper componentName="WinnerBanner">
            <WinnerBanner isVisible={true} />
          </VisibilityWrapper>

          {/* Second Round Banner */}
          {/* <VisibilityWrapper componentName="SecondRoundBanner">
            <SecondRoundBanner />
          </VisibilityWrapper> */}
        </div>

        {/* Footer */}
        <VisibilityWrapper componentName="Footer">
          <Footer onAddIncident={() => {}} />
        </VisibilityWrapper>
      </div>
    </ComponentVisibilityProvider>
  );
}
