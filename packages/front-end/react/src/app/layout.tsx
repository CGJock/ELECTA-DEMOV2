
import './globals.css'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderWrapper from '@wrappers/HeaderWrapper';
import ClientProviders from '@wrappers/i18nProvider';
import FooterWrapper from '@wrappers/FooterWrapper';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Electa Demo",
  description: "A page to analize electoral presidential results",
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
          <HeaderWrapper />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <FooterWrapper />
          </ClientProviders>
        </body>
      
    </html>
  )
}