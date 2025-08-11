'use client';

import dynamic from 'next/dynamic';

// Importa el Header y desactiva SSR (solo cliente)
const Header = dynamic(() => import('../Header'), { ssr: false });

export default function HeaderWrapper() {
  return <Header />;
}