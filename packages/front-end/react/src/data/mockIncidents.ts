import type { Incident } from '../types/election'

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: {
      es: 'Problema en mesa de votación',
      en: 'Voting Station Problem'
    },
    description: {
      es: 'Se reportó un problema técnico en la mesa de votación de la escuela San Ignacio. El equipo electrónico no funciona correctamente.',
      en: 'A technical problem was reported at the San Ignacio school voting station. Electronic equipment is not functioning properly.'
    },
    severity: 'high',
    location: {
      es: 'La Paz - Zona Sur',
      en: 'La Paz - South Zone'
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: '2',
    title: {
      es: 'Falta de material electoral',
      en: 'Lack of Electoral Material'
    },
    description: {
      es: 'Se detectó escasez de papeletas electorales en el centro de votación de Santa Cruz. Se está coordinando la entrega de material adicional.',
      en: 'Shortage of electoral ballots detected at the Santa Cruz voting center. Additional material delivery is being coordinated.'
    },
    severity: 'medium',
    location: {
      es: 'Santa Cruz - Centro',
      en: 'Santa Cruz - Downtown'
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
  },
  {
    id: '3',
    title: {
      es: 'Agresión verbal',
      en: 'Verbal Aggression'
    },
    description: {
      es: 'Se reportó agresión verbal entre simpatizantes de diferentes partidos políticos fuera del centro de votación.',
      en: 'Verbal aggression reported between supporters of different political parties outside the voting center.'
    },
    severity: 'low',
    location: {
      es: 'Cochabamba - Zona Norte',
      en: 'Cochabamba - North Zone'
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    id: '4',
    title: {
      es: 'Corte de energía',
      en: 'Power Outage'
    },
    description: {
      es: 'Corte de energía en el centro de votación de El Alto. Se están utilizando generadores de respaldo.',
      en: 'Power outage at the El Alto voting center. Backup generators are being used.'
    },
    severity: 'medium',
    location: {
      es: 'El Alto - Distrito 1',
      en: 'El Alto - District 1'
    },
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() // 1.5 hours ago
  },
  {
    id: '5',
    title: {
      es: 'Problema de conectividad',
      en: 'Connectivity Issue'
    },
    description: {
      es: 'Fallo de conexión a internet en varios centros de votación en Oruro. Se trabaja para restablecer el servicio.',
      en: 'Internet connection failure at several voting centers in Oruro. Work is being done to restore service.'
    },
    severity: 'high',
    location: {
      es: 'Oruro - Varios centros',
      en: 'Oruro - Multiple Centers'
    },
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString() // 2 hours ago
  }
] 