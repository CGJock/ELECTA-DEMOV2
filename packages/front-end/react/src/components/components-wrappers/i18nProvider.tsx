'use client';

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { SocketDataProvider } from '@/context/context';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SocketDataProvider>
      {children}
      </SocketDataProvider>
    </I18nextProvider>
  );
}