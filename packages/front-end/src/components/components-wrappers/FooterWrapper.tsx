'use client';

import dynamic from 'next/dynamic';
import type { Incident } from '@/types/election';

// Importa el Header y desactiva SSR (solo cliente)
const Footer = dynamic(() => import('@components/Footer'), { ssr: false });

interface FooterWrapperProps {
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

export default function FooterWrapper({ onAddIncident }: FooterWrapperProps) {
  return <Footer onAddIncident={onAddIncident} />;
}