"use client";

import { useState, useEffect } from 'react';
import { useSiteStatus } from './useSiteStatus';

export function useMaintenance() {
  const { 
    siteStatus, 
    loading, 
    error, 
    updateSiteStatus, 
    refreshStatus
  } = useSiteStatus();

  // Usar directamente el estado de la API
  const isMaintenanceMode = siteStatus?.maintenance_mode || false;
  const isPrivateAccess = siteStatus?.private_access || false;

  // Función para activar/desactivar modo mantenimiento
  const toggleMaintenanceMode = async () => {
    const newState = !isMaintenanceMode;
    const result = await updateSiteStatus({ maintenance_mode: newState });
    if (!result.success) {
      console.error('Error al cambiar modo mantenimiento:', result.message);
    }
  };

  // Función para activar/desactivar acceso privado
  const togglePrivateAccess = async () => {
    const newState = !isPrivateAccess;
    const result = await updateSiteStatus({ private_access: newState });
    if (!result.success) {
      console.error('Error al cambiar acceso privado:', result.message);
    }
  };

  // Función para establecer estado específico (para el admin panel)
  const setMaintenanceMode = async (state: boolean) => {
    const result = await updateSiteStatus({ maintenance_mode: state });
    if (!result.success) {
      console.error('Error al establecer modo mantenimiento:', result.message);
    }
  };

  const setPrivateAccess = async (state: boolean) => {
    const result = await updateSiteStatus({ private_access: state });
    if (!result.success) {
      console.error('Error al establecer acceso privado:', result.message);
    }
  };

  return {
    isMaintenanceMode,
    isPrivateAccess,
    toggleMaintenanceMode,
    togglePrivateAccess,
    setMaintenanceMode,
    setPrivateAccess,
    loading,
    error,
    refreshStatus
  };
}
