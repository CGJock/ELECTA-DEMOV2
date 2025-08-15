"use client";

import React from 'react';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useWhitelistAccess } from '@/hooks/useWhitelistAccess';
import MaintenancePage from './MaintenancePage';
import { usePathname } from 'next/navigation';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

export default function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  const { isMaintenanceMode, isPrivateAccess } = useMaintenance();
  const { isVerified, user } = useWhitelistAccess();
  const pathname = usePathname();

  // NO mostrar página de mantenimiento en rutas de admin
  const isAdminRoute = pathname?.startsWith('/admin');

  // Si está en modo mantenimiento, mostrar página de mantenimiento
  if (isMaintenanceMode && !isAdminRoute) {
    return <MaintenancePage isPrivateAccess={false} />;
  }

  // Si está en modo acceso privado, Y NO es una ruta de admin, Y el usuario NO está verificado
  if (isPrivateAccess && !isAdminRoute && !isVerified) {
    return <MaintenancePage isPrivateAccess={true} />;
  }

  // Si no está en mantenimiento, o es una ruta de admin, o el usuario está verificado, mostrar el contenido normal
  return <>{children}</>;
}
