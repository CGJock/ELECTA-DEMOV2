"use client";

import React from 'react';
import { useMaintenance } from '@/hooks/useMaintenance';
import MaintenancePage from './MaintenancePage';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

export default function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  const { isMaintenanceMode } = useMaintenance();

  // Si está en modo mantenimiento, mostrar la página de mantenimiento
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Si no está en mantenimiento, mostrar el contenido normal
  return <>{children}</>;
}
