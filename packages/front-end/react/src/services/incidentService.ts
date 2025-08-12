import type { Incident } from '@/types/election';

export interface CreateIncidentData {
  title: { es: string; en: string };
  description: { es: string; en: string };
  location: { es: string; en: string };
}

export class IncidentService {
  static addIncidentToState(incidentData: CreateIncidentData, currentIncidents: Incident[]): Incident[] {
    const newIncident: Incident = {
      id: Date.now().toString(),
      ...incidentData,
      status: 'new',
      timestamp: new Date().toISOString()
    };
    
    return [...currentIncidents, newIncident];
  }

  static updateIncidentStatus(
    incidentId: string, 
    newStatus: Incident['status'], 
    currentIncidents: Incident[]
  ): Incident[] {
    return currentIncidents.map(incident =>
      incident.id === incidentId 
        ? { ...incident, status: newStatus }
        : incident
    );
  }

  static removeIncident(incidentId: string, currentIncidents: Incident[]): Incident[] {
    return currentIncidents.filter(incident => incident.id !== incidentId);
  }

  static getActiveIncidents(incidents: Incident[]): Incident[] {
    return incidents.filter(incident => incident.status !== 'resolved');
  }

  static getIncidentsByStatus(incidents: Incident[], status: Incident['status']): Incident[] {
    return incidents.filter(incident => incident.status === status);
  }
}

