
import './globals.css'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderWrapper from '@/components/components-wrappers/HeaderWrapper';
import ClientProviders from '@/components/components-wrappers/i18nProvider';
import FooterWrapper from '@/components/components-wrappers/FooterWrapper';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';
import { AuthProvider } from '@/context/authContext';


const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "ELECTA - Dashboard Electoral",
  description: "Plataforma profesional de monitoreo electoral y visualización de datos en tiempo real para Bolivia. Resultados electorales, mapas interactivos y reportes de incidentes.",
  keywords: "elecciones, Bolivia, dashboard electoral, resultados en tiempo real, monitoreo electoral",
  authors: [{ name: "ELECTA Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html  className="dark">
      
        <body 
          
          className={inter.className}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0F1C 0%, #0F172A 100%)',
          }}
        >
          <ClientProviders>
            <div>
              {/* <NotificationService /> */}
              <MaintenanceWrapper>
                {children}
              </MaintenanceWrapper>
              {/* <FooterWrapper onAddIncident={(incident) => {
                // TODO: Implementar lógica para agregar incidentes
                console.log('Nuevo incidente:', incident);
              }} /> */}
            </div>
          </ClientProviders>
        </body>
      
    </html>
  )
}