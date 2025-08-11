import type { PoliticalParty, ElectionData } from '../types/election'

export const mockParties: PoliticalParty[] = [
  {
    id: '1',
    name: 'MAS-IPSP',
    abbreviation: 'MAS',
    aliases: ['MAS-IPSP', 'MAS', 'IPSP'],
    color: '#FF6B35',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '1',
      name: 'Eduardo Castillo',
      photo: '/img/EduardoCastillo.MAS-IPSP.png',
      age: 45,
      party: 'MAS-IPSP',
      experience: 'Ex Ministro de Economía y Finanzas Públicas',
      education: 'Economista, Universidad Mayor de San Andrés',
      proposals: [
        { es: 'Continuar con el modelo económico social comunitario', en: 'Continue the social community economic model' },
        { es: 'Fortalecer la industrialización', en: 'Strengthen industrialization' },
        { es: 'Mantener la soberanía nacional', en: 'Maintain national sovereignty' }
      ]
    }
  },
  {
    id: '2',
    name: 'Alianza Popular',
    abbreviation: 'AP',
    aliases: ['Alianza Popular', 'AP','PAN-BOL'],
    color: '#4A90E2',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '2',
      name: 'Andrónico Rodríguez',
      photo: '/img/AndrónicoRodríguez.AlianzaPopular.png',
      age: 35,
      party: 'Alianza Popular',
      experience: 'Ex Senador',
      education: 'Ingeniero, Universidad Mayor de San Andrés',
      proposals: [
        { es: 'Recuperar la democracia y las instituciones', en: 'Restore democracy and institutions' },
        { es: 'Promover la inversión privada', en: 'Promote private investment' },
        { es: 'Mejorar las relaciones internacionales', en: 'Improve international relations' }
      ]
    }
  },
  {
    id: '3',
    name: 'Frente Popular',
    abbreviation: 'FP',
    aliases: ['Frente Popular', 'FP', 'FPV'],
    color: '#50C878',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '3',
      name: 'Jhonny Fernández',
      photo: '/img/JhonnyFernandez.FP.png',
      age: 44,
      party: 'Frente Popular',
      experience: 'Ex Gobernador de Santa Cruz',
      education: 'Abogado, Universidad Católica Boliviana',
      proposals: [
        { es: 'Descentralización y autonomías', en: 'Decentralization and autonomies' },
        { es: 'Libre mercado y emprendimiento', en: 'Free market and entrepreneurship' },
        { es: 'Seguridad ciudadana', en: 'Citizen security' }
      ]
    }
  },
  {
    id: '4',
    name: 'Alianza LIBRE',
    abbreviation: 'LIBRE',
    aliases: ['Alianza LIBRE', 'AL', 'LIBRE'],
    color: '#FFD700',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '4',
      name: 'Jorge Tuto Quiroga',
      photo: '/img/JorgeTutoQuiroga.AlianzaLIBRE.png',
      age: 63,
      party: 'Alianza LIBRE',
      experience: 'Ex Presidente de Bolivia (2001-2002)',
      education: 'Ingeniero Industrial, Texas A&M University',
      proposals: [
        { es: 'Unidad nacional y reconciliación', en: 'National unity and reconciliation' },
        { es: 'Economía de mercado social', en: 'Social market economy' },
        { es: 'Integración internacional', en: 'International integration' }
      ]
    }
  },
  {
    id: '5',
    name: 'Partido Demócrata Cristiano',
    abbreviation: 'PDC',
    aliases: ['Partido Demócrata Cristiano', 'PDC', 'PC'],
    color: '#8B4513',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '5',
      name: 'Rodrigo Paz Pereira',
      photo: '/img/RodrigoPazPereira.PDC.png',
      age: 52,
      party: 'PDC',
      experience: 'Ex Senador',
      education: 'Médico, Universidad Mayor de San Andrés',
      proposals: [
        { es: 'Lucha contra la corrupción', en: 'Fight against corruption' },
        { es: 'Transparencia en la gestión pública', en: 'Transparency in public management' },
        { es: 'Mejora del sistema de salud', en: 'Improvement of the health system' }
      ]
    }
  },
  {
    id: '6',
    name: 'LYP-ADN',
    abbreviation: 'ADN',
    aliases: ['LYP-ADN', 'ADN', 'AD'],
    color: '#DC2626',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '6',
      name: 'Pavel Aracena',
      photo: '/img/PavelAracena.LYP-ADN.png',
      age: 48,
      party: 'LYP-ADN',
      experience: 'Ex Diputado',
      education: 'Abogado, Universidad Mayor de San Andrés',
      proposals: [
        { es: 'Fortalecimiento de la democracia', en: 'Strengthening democracy' },
        { es: 'Transparencia gubernamental', en: 'Government transparency' },
        { es: 'Desarrollo económico sostenible', en: 'Sustainable economic development' }
      ]
    }
  },
  {
    id: '7',
    name: 'NGP',
    abbreviation: 'NGP',
    aliases: ['NGP'],
    color: '#F43F5E',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '7',
      name: 'Jaime Dunn',
      photo: '/img/JaimeDunn.NGP.png',
      age: 55,
      party: 'NGP',
      experience: 'Ex Ministro',
      education: 'Economista, Universidad Católica Boliviana',
      proposals: [
        { es: 'Nuevo modelo de gobierno', en: 'New government model' },
        { es: 'Innovación tecnológica', en: 'Technological innovation' },
        { es: 'Educación de calidad', en: 'Quality education' }
      ]
    }
  } 
]

export const mockElectionData: ElectionData = {
  parties: mockParties,
  totalVotes: 5420000,
  lastUpdate: new Date().toISOString()
} 