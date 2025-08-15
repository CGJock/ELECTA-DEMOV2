import React, { useState, useEffect } from 'react';
import { useComponentVisibility } from '../../context/componentVisibilityContext';
import { useTranslation } from 'react-i18next';

const ComponentVisibilitySection: React.FC = () => {
  const {
    phases,
    activePhase,
    phaseComponents,
    isLoading,
    error,
    loadPhases,
    loadPhaseComponents,
    activatePhase,
    updateComponentVisibility
  } = useComponentVisibility();

  const { t } = useTranslation();

  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<{[key: string]: boolean}>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Lista de componentes sin iconos, completamente profesional
  const availableComponents = [
    { name: 'Header', description: 'Barra de navegación principal' },
    { name: 'GlobalCounter', description: 'Contador global de votos' },
    { name: 'Map', description: 'Mapa interactivo de resultados' },
    { name: 'StatsContainer', description: 'Estadísticas y gráficos' },
    { name: 'IncidentsFlag', description: 'Bandera de incidentes' },
    { name: 'Footer', description: 'Pie de página' },
    { name: 'ElectionReportTable', description: 'Tabla de reportes' },
    { name: 'SecondRoundBanner', description: 'Banner de segunda vuelta' },
    { name: 'WinnerBanner', description: 'Banner del ganador' }
  ];

  // Cargar fases al montar el componente
  useEffect(() => {
    loadPhases();
  }, [loadPhases]);

  // Establecer fase seleccionada cuando se cargan las fases
  useEffect(() => {
    if (phases.length > 0 && !selectedPhase) {
      setSelectedPhase(phases[0]);
    }
  }, [phases, selectedPhase]);

  // Cargar componentes cuando cambie la fase seleccionada
  useEffect(() => {
    if (selectedPhase) {
      loadPhaseComponents(selectedPhase);
      setPendingChanges({});
      setHasChanges(false);
      setSaveStatus('idle');
    }
  }, [selectedPhase, loadPhaseComponents]);

  // Manejar cambio de fase
  const handlePhaseChange = (phaseName: string) => {
    if (hasChanges) {
      if (confirm('Tienes cambios sin guardar. ¿Quieres cambiar de fase sin guardar?')) {
        setSelectedPhase(phaseName);
        setPendingChanges({});
        setHasChanges(false);
        setSaveStatus('idle');
      }
    } else {
      setSelectedPhase(phaseName);
    }
  };

  // Manejar cambio de visibilidad de componente
  const handleComponentToggle = (componentName: string, isVisible: boolean) => {
    setPendingChanges(prev => ({
      ...prev,
      [componentName]: isVisible
    }));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      // Aplicar cada cambio individualmente
      for (const [componentName, isVisible] of Object.entries(pendingChanges)) {
        await updateComponentVisibility(componentName, selectedPhase, isVisible);
      }
      
      // Recargar componentes para mostrar estado actualizado
      await loadPhaseComponents(selectedPhase);
      
      // Limpiar cambios pendientes
      setPendingChanges({});
      setHasChanges(false);
      setSaveStatus('success');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setSaveStatus('error');
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  // Obtener visibilidad actual de un componente
  const getCurrentComponentVisibility = (componentName: string): boolean => {
    // Primero verificar cambios pendientes
    if (componentName in pendingChanges) {
      return pendingChanges[componentName];
    }
    
    // Luego verificar estado en la base de datos
    const phaseData = phaseComponents.find(pc => pc.phase_name === selectedPhase);
    if (phaseData && phaseData.components) {
      const component = phaseData.components.find(comp => comp.component_name === componentName);
      if (component) {
        return component.is_visible;
      }
    }
    return true; // Por defecto visible
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded-lg w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-300 mb-2">Error del Sistema</h3>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
      {/* Header Principal - Más Compacto */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 py-4 rounded-t-xl border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div>
                          <h3 className="text-xl font-bold text-slate-100">
                {t('admin.sections.component_visibility.title')}
              </h3>
              <p className="text-slate-300 text-sm mt-0.5">
                {t('admin.sections.component_visibility.description')}
              </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">V</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Fase Activa Actual - Más Compacta */}
        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
                              <h4 className="text-xs font-medium text-blue-200 uppercase tracking-wide">{t('admin.sections.component_visibility.active_phase')}</h4>
              <p className="text-lg font-bold text-blue-100">{activePhase || 'Ninguna'}</p>
            </div>
            <div className="px-3 py-1.5 bg-blue-600/80 text-white text-xs font-semibold rounded-md border border-blue-500/50">
              ACTIVA
            </div>
          </div>
        </div>

        {/* Selector de Fase - Más Compacto */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
                      <label className="block text-sm font-medium text-slate-200 mb-2 uppercase tracking-wide">
              {t('admin.sections.component_visibility.phase_to_edit')}
            </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedPhase}
              onChange={(e) => handlePhaseChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {phases.map((phase) => (
                <option key={phase} value={phase} className="bg-slate-700 text-slate-100">
                  {phase}
                </option>
              ))}
            </select>
            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                disabled={saveStatus === 'saving'}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  saveStatus === 'saving'
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {saveStatus === 'saving' ? t('admin.sections.component_visibility.saving') : t('admin.sections.component_visibility.save_changes')}
              </button>
            )}
          </div>
        </div>

        {/* Componentes de la Fase Seleccionada - Grid Más Compacto */}
        {selectedPhase && (
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-base font-semibold text-slate-100">
                  {t('admin.sections.component_visibility.components')}: {selectedPhase}
                </h4>
                <div className="text-xs text-slate-400">
                  {Object.keys(pendingChanges).length} {t('admin.sections.component_visibility.pending_changes')}
                </div>
            </div>
            
            {/* Mensajes de Estado - Más Compactos */}
            {saveStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-md">
                <p className="text-green-300 text-xs font-medium">✓ {t('admin.sections.component_visibility.changes_saved')}</p>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-md">
                <p className="text-red-300 text-xs font-medium">✗ {t('admin.sections.component_visibility.save_error')}</p>
              </div>
            )}
            
            {/* Grid de Componentes - Más Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableComponents.map((component) => (
                <div 
                  key={component.name} 
                  className="bg-slate-700/50 border border-slate-600 rounded-md p-3 hover:border-slate-500 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-slate-100 text-sm truncate">
                        {component.name}
                      </h5>
                      <p className="text-slate-400 text-xs mt-0.5 truncate">
                        {component.description}
                      </p>
                    </div>
                    
                    {/* Switch Compacto */}
                    <label className="relative inline-flex items-center cursor-pointer ml-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={getCurrentComponentVisibility(component.name)}
                        onChange={(e) => handleComponentToggle(component.name, e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                    </label>
                  </div>
                  
                  {/* Estado Visual - Más Compacto */}
                  <div className={`mt-2 text-center py-1 px-2 rounded text-xs font-medium ${
                    getCurrentComponentVisibility(component.name)
                      ? 'bg-green-900/30 text-green-300 border border-green-700/50'
                      : 'bg-slate-600/50 text-slate-400 border border-slate-600'
                  }`}>
                    {getCurrentComponentVisibility(component.name) ? t('admin.sections.component_visibility.visible') : t('admin.sections.component_visibility.hidden')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del Sistema - Más Compacta */}
        <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-slate-200 mb-3 uppercase tracking-wide">{t('admin.sections.component_visibility.system_info')}</h5>
          <div className="text-xs text-slate-400">
            <p>{t('admin.sections.component_visibility.system_info_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentVisibilitySection;