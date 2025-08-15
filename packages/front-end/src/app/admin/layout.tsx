'use client';

import React from 'react';
import { AuthProvider } from '@/context/authContext';
import { AdminManagementProvider } from '@/context/adminManagementContext';
import { ComponentVisibilityProvider } from '@/context/componentVisibilityContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminManagementProvider>
        <ComponentVisibilityProvider>
          {children}
        </ComponentVisibilityProvider>
      </AdminManagementProvider>
    </AuthProvider>
  );
}
