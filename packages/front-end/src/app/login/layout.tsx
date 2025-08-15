'use client';

import React from 'react';
import { AuthProvider } from '@/context/authContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
    {children}
    </AuthProvider>
  );
}