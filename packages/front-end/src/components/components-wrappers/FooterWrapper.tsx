'use client';

import dynamic from 'next/dynamic';

// Importa el Header y desactiva SSR (solo cliente)
const Footer = dynamic(() => import('../Footer'), { ssr: false });

export default function FooterWrapper() {
  return <Footer />;
}