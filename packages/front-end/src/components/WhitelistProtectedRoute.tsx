'use client';

import React, { useEffect } from 'react';
import { useWhitelistAccess } from '@/hooks/useWhitelistAccess';
import { useMaintenance } from '@/hooks/useMaintenance';
import MaintenancePage from './MaintenancePage';

interface WhitelistProtectedRouteProps {
  children: React.ReactNode;
}

export default function WhitelistProtectedRoute({ children }: WhitelistProtectedRouteProps) {
  const { isVerified, isLoading, user } = useWhitelistAccess();
  const { isPrivateAccess } = useMaintenance();

  // Si está en modo de acceso privado y no está verificado, mostrar página de verificación
  if (isPrivateAccess && !isVerified) {
    return <MaintenancePage isPrivateAccess={true} />;
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si está verificado, mostrar el contenido
  if (isVerified && user) {
    return <>{children}</>;
  }

  // Si no está en modo privado, mostrar contenido normal
  if (!isPrivateAccess) {
    return <>{children}</>;
  }

  // Fallback - mostrar página de verificación
  return <MaintenancePage isPrivateAccess={true} />;
}
