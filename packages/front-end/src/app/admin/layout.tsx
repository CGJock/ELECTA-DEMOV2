'use client';

import React from 'react';
import { AuthProvider } from '@/context/authContext';
import { AdminManagementProvider } from '@/context/adminManagementContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminManagementProvider>
        {children}
      </AdminManagementProvider>
    </AuthProvider>
  );
}
