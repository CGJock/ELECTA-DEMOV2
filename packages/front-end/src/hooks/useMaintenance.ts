"use client";

import { useState, useEffect } from 'react';

export function useMaintenance() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isPrivateAccess, setIsPrivateAccess] = useState(false);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const savedMaintenance = localStorage.getItem('maintenanceMode');
    const savedPrivateAccess = localStorage.getItem('privateAccess');
    
    if (savedMaintenance) {
      setIsMaintenanceMode(JSON.parse(savedMaintenance));
    }
    
    if (savedPrivateAccess) {
      setIsPrivateAccess(JSON.parse(savedPrivateAccess));
    }
  }, []);

  // Función para activar/desactivar modo mantenimiento
  const toggleMaintenanceMode = () => {
    const newState = !isMaintenanceMode;
    setIsMaintenanceMode(newState);
    localStorage.setItem('maintenanceMode', JSON.stringify(newState));
  };

  // Función para activar/desactivar acceso privado
  const togglePrivateAccess = () => {
    const newState = !isPrivateAccess;
    setIsPrivateAccess(newState);
    localStorage.setItem('privateAccess', JSON.stringify(newState));
  };

  // Función para establecer estado específico (para el admin panel)
  const setMaintenanceMode = (state: boolean) => {
    setIsMaintenanceMode(state);
    localStorage.setItem('maintenanceMode', JSON.stringify(state));
  };

  const setPrivateAccess = (state: boolean) => {
    setIsPrivateAccess(state);
    localStorage.setItem('privateAccess', JSON.stringify(state));
  };

  return {
    isMaintenanceMode,
    isPrivateAccess,
    toggleMaintenanceMode,
    togglePrivateAccess,
    setMaintenanceMode,
    setPrivateAccess
  };
}
