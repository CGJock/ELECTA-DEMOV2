import { useState, useCallback } from 'react';
import type { Incident } from '@/types/election';
import { IncidentService, type CreateIncidentData } from '@/services/incidentService';
import { mockIncidents } from '@data/mockIncidents';

export const useIncidents = (initialIncidents: Incident[] = mockIncidents) => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const addIncident = useCallback((incidentData: CreateIncidentData) => {
    setIncidents(prevIncidents => 
      IncidentService.addIncidentToState(incidentData, prevIncidents)
    );
  }, []);

  const updateIncidentStatus = useCallback((
    incidentId: string,
    newStatus: Incident['status']
  ) => {
    setIncidents(prevIncidents =>
      IncidentService.updateIncidentStatus(incidentId, newStatus, prevIncidents)
    );
  }, []);

  const removeIncident = useCallback((incidentId: string) => {
    setIncidents(prevIncidents =>
      IncidentService.removeIncident(incidentId, prevIncidents)
    );
  }, []);

  const getActiveIncidents = useCallback(() => {
    return IncidentService.getActiveIncidents(incidents);
  }, [incidents]);

  const getIncidentsByStatus = useCallback((status: Incident['status']) => {
    return IncidentService.getIncidentsByStatus(incidents, status);
  }, [incidents]);

  const getNewIncidents = useCallback(() => {
    return getIncidentsByStatus('new');
  }, [getIncidentsByStatus]);

  const getStuckIncidents = useCallback(() => {
    return getIncidentsByStatus('stuck');
  }, [getIncidentsByStatus]);

  const getResolvedIncidents = useCallback(() => {
    return getIncidentsByStatus('resolved');
  }, [getIncidentsByStatus]);

  return {
    // Estado
    incidents,
    
    // Acciones principales
    addIncident,
    updateIncidentStatus,
    removeIncident,
    
    // Consultas
    getActiveIncidents,
    getIncidentsByStatus,
    getNewIncidents,
    getStuckIncidents,
    getResolvedIncidents,
    
    // Estadísticas
    totalIncidents: incidents.length,
    activeIncidentsCount: getActiveIncidents().length,
    newIncidentsCount: getNewIncidents().length,
    stuckIncidentsCount: getStuckIncidents().length,
    resolvedIncidentsCount: getResolvedIncidents().length,
  };
};