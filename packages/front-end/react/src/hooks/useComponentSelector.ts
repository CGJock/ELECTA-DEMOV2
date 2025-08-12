"use client";

import { useState, useEffect } from 'react';

interface Component {
  id: string;
  name: string;
  visible: boolean;
}

interface PhaseConfig {
  before: Component[];
  during: Component[];
  after: Component[];
}

export const useComponentSelector = () => {
  // Lista fija de componentes disponibles (siempre los mismos)
  const allComponents = [
    { id: 'header', name: 'Header Navigation' },
    { id: 'countdown', name: 'Countdown Timer' },
    { id: 'live-results', name: 'Live Results Feed' },
    { id: 'incident-reports', name: 'Incident Reports' },
    { id: 'interactive-map', name: 'Interactive Map' },
    { id: 'party-breakdown', name: 'Party Breakdown Chart' },
    { id: 'candidate-profiles', name: 'Candidate Profiles' },
    { id: 'election-report', name: 'Election Report Table' },
    { id: 'final-results', name: 'Final Results' },
    { id: 'footer', name: 'Footer' }
  ];

  // Estado para la fase activa (solo una a la vez)
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('before');
  
  // Configuración de visibilidad por fase
  const [phaseConfig, setPhaseConfig] = useState<PhaseConfig>({
    before: allComponents.map(comp => ({ 
      ...comp, 
      visible: ['header', 'countdown', 'election-report', 'footer'].includes(comp.id)
    })),
    during: allComponents.map(comp => ({ 
      ...comp, 
      visible: ['header', 'live-results', 'incident-reports', 'footer'].includes(comp.id)
    })),
    after: allComponents.map(comp => ({ 
      ...comp, 
      visible: ['header', 'final-results', 'party-breakdown', 'footer'].includes(comp.id)
    }))
  });

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('electa-phase-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setPhaseConfig(parsed);
      } catch (error) {
        console.warn('Error al cargar configuración de fases:', error);
      }
    }
  }, []);

  // Guardar configuración en localStorage
  const saveConfigToStorage = (config: PhaseConfig) => {
    localStorage.setItem('electa-phase-config', JSON.stringify(config));
  };

  // Cambiar fase activa (desactiva la anterior)
  const setActivePhaseAndReset = (phase: 'before' | 'during' | 'after') => {
    setActivePhase(phase);
  };

  // Toggle de visibilidad de un componente en la fase activa
  const toggleComponentVisibility = (componentId: string) => {
    const newConfig = {
      ...phaseConfig,
      [activePhase]: phaseConfig[activePhase].map(comp =>
        comp.id === componentId ? { ...comp, visible: !comp.visible } : comp
      )
    };
    setPhaseConfig(newConfig);
    saveConfigToStorage(newConfig);
  };

  // Guardar configuración de la fase actual
  const saveConfiguration = () => {
    saveConfigToStorage(phaseConfig);
    return true;
  };

  // Aplicar configuración al sitio
  const applyToSite = () => {
    saveConfigToStorage(phaseConfig);
    return true;
  };

  // Obtener componentes visibles de la fase activa
  const getVisibleComponentsCount = () => {
    return phaseConfig[activePhase].filter(comp => comp.visible).length;
  };

  // Obtener total de componentes
  const getTotalComponentsCount = () => {
    return allComponents.length;
  };

  // Obtener componentes de la fase activa
  const getActivePhaseComponents = () => {
    return phaseConfig[activePhase];
  };

  // Obtener nombre de la fase activa
  const getActivePhaseName = () => {
    switch (activePhase) {
      case 'before': return 'Antes';
      case 'during': return 'Durante';
      case 'after': return 'Después';
      default: return '';
    }
  };

  return {
    activePhase,
    setActivePhase: setActivePhaseAndReset,
    phaseConfig,
    toggleComponentVisibility,
    saveConfiguration,
    applyToSite,
    getVisibleComponentsCount,
    getTotalComponentsCount,
    getActivePhaseComponents,
    getActivePhaseName,
    allComponents
  };
};
