'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { initializeLanguage } from '@/lib/i18n';
import { SocketDataProvider } from '@contexts/context';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inicializar el idioma cuando el componente se monte
    initializeLanguage();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SocketDataProvider>
        {children}
      </SocketDataProvider>
    </I18nextProvider>
  );
}