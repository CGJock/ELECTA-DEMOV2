import type { Incident } from '@/types/election';

// Lista de emails autorizados para reportar incidentes
export const volunteerEmails = [
  'voluntario1@example.com',
  'voluntario2@example.com',
  'monitor@example.com',
  'supervisor@example.com',
  'admin@example.com'
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: { es: 'Problema de conectividad', en: 'Connectivity issue' },
    description: { es: 'Se reportó pérdida de señal en el centro de votación', en: 'Signal loss reported at voting center' },
    status: 'new',
    location: { es: 'La Paz, Centro', en: 'La Paz, Center' },
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: { es: 'Falta de material electoral', en: 'Missing electoral material' },
    description: { es: 'No hay suficientes boletas en el recinto', en: 'Not enough ballots at the precinct' },
    status: 'stuck',
    location: { es: 'Cochabamba, Norte', en: 'Cochabamba, North' },
    timestamp: '2024-01-15T11:15:00Z'
  },
  {
    id: '3',
    title: { es: 'Incidente resuelto', en: 'Resolved incident' },
    description: { es: 'Problema de energía eléctrica solucionado', en: 'Power issue resolved' },
    status: 'resolved',
    location: { es: 'Santa Cruz, Este', en: 'Santa Cruz, East' },
    timestamp: '2024-01-15T09:45:00Z'
  }
]; 