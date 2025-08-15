import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { componentVisibilityService, ComponentVisibility, PhaseComponents } from '../services/componentVisibilityService';

interface ComponentVisibilityContextType {
  // Estado
  phases: string[];
  activePhase: string;
  phaseComponents: PhaseComponents[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  loadPhases: () => Promise<void>;
  loadActivePhase: () => Promise<void>;
  loadPhaseComponents: (phaseName: string) => Promise<void>;
  activatePhase: (phaseName: string) => Promise<void>;
  updateComponentVisibility: (componentName: string, phaseName: string, isVisible: boolean) => Promise<void>;
  applyChanges: (phaseName: string, components: ComponentVisibility[]) => Promise<void>;
  
  // Utilidades
  isComponentVisible: (componentName: string) => boolean;
  getComponentVisibility: (componentName: string, phaseName: string) => boolean;
}

const ComponentVisibilityContext = createContext<ComponentVisibilityContextType | undefined>(undefined);

interface ComponentVisibilityProviderProps {
  children: ReactNode;
}

export const ComponentVisibilityProvider: React.FC<ComponentVisibilityProviderProps> = ({ children }) => {
  const [phases, setPhases] = useState<string[]>([]);
  const [activePhase, setActivePhase] = useState<string>('');
  const [phaseComponents, setPhaseComponents] = useState<PhaseComponents[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las fases disponibles
  const loadPhases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const phasesData = await componentVisibilityService.getPhases();
      setPhases(phasesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las fases');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar la fase activa actual
  const loadActivePhase = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activePhaseData = await componentVisibilityService.getActivePhase();
      setActivePhase(activePhaseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la fase activa');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar componentes de una fase específica
  const loadPhaseComponents = useCallback(async (phaseName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const components = await componentVisibilityService.getPhaseComponents(phaseName);
      
      // Actualizar o agregar la fase a la lista
      setPhaseComponents(prev => {
        const existingIndex = prev.findIndex(pc => pc.phase_name === phaseName);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { phase_name: phaseName, components };
          return updated;
        } else {
          return [...prev, { phase_name: phaseName, components }];
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los componentes de la fase');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Activar una fase específica
  const activatePhase = useCallback(async (phaseName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await componentVisibilityService.activatePhase(phaseName);
      setActivePhase(phaseName);
      
      // Recargar los componentes de la nueva fase activa
      await loadPhaseComponents(phaseName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar la fase');
    } finally {
      setIsLoading(false);
    }
  }, [loadPhaseComponents]);

  // Actualizar visibilidad de un componente
  const updateComponentVisibility = useCallback(async (componentName: string, phaseName: string, isVisible: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedComponent = await componentVisibilityService.updateComponentVisibility(
        componentName, 
        phaseName, 
        isVisible
      );
      
      // Actualizar el estado local
      setPhaseComponents(prev => 
        prev.map(pc => {
          if (pc.phase_name === phaseName) {
            return {
              ...pc,
              components: pc.components.map(comp => 
                comp.component_name === componentName ? updatedComponent : comp
              )
            };
          }
          return pc;
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la visibilidad del componente');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar cambios de visibilidad
  const applyChanges = useCallback(async (phaseName: string, components: ComponentVisibility[]) => {
    try {
      setIsLoading(true);
      setError(null);
      await componentVisibilityService.applyChanges(phaseName, components);
      
      // Recargar los componentes para asegurar sincronización
      await loadPhaseComponents(phaseName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar los cambios');
    } finally {
      setIsLoading(false);
    }
  }, [loadPhaseComponents]);

  // Verificar si un componente está visible en la fase activa
  const isComponentVisible = (componentName: string): boolean => {
    if (!activePhase) return true; // Si no hay fase activa, mostrar todo
    
    const phaseData = phaseComponents.find(pc => pc.phase_name === activePhase);
    if (!phaseData) return true; // Si no hay datos de la fase, mostrar todo
    
    const component = phaseData.components.find(comp => comp.component_name === componentName);
    return component ? component.is_visible : true; // Por defecto visible si no está configurado
  };

  // Obtener visibilidad de un componente en una fase específica
  const getComponentVisibility = (componentName: string, phaseName: string): boolean => {
    const phaseData = phaseComponents.find(pc => pc.phase_name === phaseName);
    if (!phaseData) return true;
    
    const component = phaseData.components.find(comp => comp.component_name === componentName);
    return component ? component.is_visible : true;
  };

  // Cargar datos iniciales
  useEffect(() => {
    const initializeData = async () => {
      await loadPhases();
      await loadActivePhase();
    };
    
    initializeData();
  }, []);

  // Cargar componentes cuando cambie la fase activa
  useEffect(() => {
    if (activePhase) {
      loadPhaseComponents(activePhase);
    }
  }, [activePhase, loadPhaseComponents]);

  const value: ComponentVisibilityContextType = {
    phases,
    activePhase,
    phaseComponents,
    isLoading,
    error,
    loadPhases,
    loadActivePhase,
    loadPhaseComponents,
    activatePhase,
    updateComponentVisibility,
    applyChanges,
    isComponentVisible,
    getComponentVisibility,
  };

  return (
    <ComponentVisibilityContext.Provider value={value}>
      {children}
    </ComponentVisibilityContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useComponentVisibility = (): ComponentVisibilityContextType => {
  const context = useContext(ComponentVisibilityContext);
  if (context === undefined) {
    throw new Error('useComponentVisibility debe ser usado dentro de un ComponentVisibilityProvider');
  }
  return context;
};

export default ComponentVisibilityProvider;
