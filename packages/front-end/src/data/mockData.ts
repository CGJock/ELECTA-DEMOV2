import type { PoliticalParty, ElectionData } from '../types/election'

export const mockParties: PoliticalParty[] = [
  {
    id: '1',
    name: 'MAS-IPSP',
    abbreviation: 'MAS',
    aliases: ['MAS-IPSP', 'MAS', 'IPSP', 'Movimiento al Socialismo', 'MAS Bolivia', 'MAS Evo', 'MAS Arce', 'MAS oficialista', 'MAS oficial'],
    color: '#FF6B35',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '1',
      name: 'Eduardo Castillo',
      photo: '/img/EduardoCastillo.MAS-IPSP.png',
      age: 45,
      experience: { 
        es: 'Ex Ministro de Economía y Finanzas Públicas', 
        en: 'Former Minister of Economy and Public Finance' 
      },
      education: { 
        es: 'Economista, Universidad Mayor de San Andrés', 
        en: 'Economist, Universidad Mayor de San Andrés' 
      },
      proposals: [
        { es: 'Continuar con el modelo económico social comunitario', en: 'Continue the social community economic model' },
        { es: 'Fortalecer la industrialización', en: 'Strengthen industrialization' },
        { es: 'Mantener la soberanía nacional', en: 'Maintain national sovereignty' }
      ],
      socials: { threads: 'https://x.com/edelcastillodc?lang=es', facebook: '', instagram: 'https://www.instagram.com/edelcastillodc/?hl=es', web: '' }
    }
  },
  {
    id: '2',
    name: 'Alianza Popular',
    abbreviation: 'AP',
    aliases: ['Alianza Popular', 'AP', 'PAN-BOL', 'AP Bolivia'],
    color: '#4A90E2',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '2',
      name: 'Andrónico Rodríguez',
      photo: '/img/AndrónicoRodríguez.AlianzaPopular.png',
      age: 35,
      experience: { 
        es: 'Ex Senador', 
        en: 'Former Senator' 
      },
      education: { 
        es: 'Ingeniero, Universidad Mayor de San Andrés', 
        en: 'Engineer, Universidad Mayor de San Andrés' 
      },
      proposals: [
        { es: 'Recuperar la democracia y las instituciones', en: 'Restore democracy and institutions' },
        { es: 'Promover la inversión privada', en: 'Promote private investment' },
        { es: 'Mejorar las relaciones internacionales', en: 'Improve international relations' }
      ],
      socials: { threads: 'https://x.com/AndronicoRod?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor', facebook: 'https://www.facebook.com/AndronicoRodriguezL/about?locale=es_LA', instagram: 'https://www.instagram.com/andronico.rodriguez/?hl=es', web: '' }
    }
  },
  {
    id: '3',
    name: 'AUTONOMIA PARA BOLIVIA SUMATE',
    abbreviation: 'FP',
    aliases: ['Frente Popular', 'FP', 'Frente Popular Bolivia','SUMATE','APB','APB-SUMATE'],
    color: '#50C878',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '3',
      name: 'Manfred Reyes Villa',
      photo: '/img/ManfredReyesVilla.AlianzaABPSumate.png',
      age: 69,
      experience: { 
        es: 'Ex Alcalde de Cochabamba (1993-2000), Ex Prefecto de Cochabamba (2006-2008), Alcalde actual de Cochabamba (2021-presente), Ex Militar', 
        en: 'Former Mayor of Cochabamba (1993-2000), Former Prefect of Cochabamba (2006-2008), Current Mayor of Cochabamba (2021-present), Former Military Officer' 
      },
      education: { 
        es: 'Colegio Militar de Ejército (1973-1977), Ex Militar con grado de Subteniente', 
        en: 'Army Military College (1973-1977), Former Military Officer with Lieutenant rank' 
      },
      proposals: [
        { es: 'Descentralización y autonomías', en: 'Decentralization and autonomies' },
        { es: 'Libre mercado y emprendimiento', en: 'Free market and entrepreneurship' },
        { es: 'Seguridad ciudadana', en: 'Citizen security' },
        { es: 'Combustibles a 5 bolivianos el litro', en: 'Fuel at 5 bolivianos per liter' }
      ],
      socials: { 
        threads: '', 
        facebook: 'https://www.facebook.com/ManfredReyesVillaOficial/', 
        instagram: 'https://www.instagram.com/manfred_oficial/', 
        web: '' 
      }
    }
  },
  {
    id: '4',
    name: 'Alianza LIBRE',
    abbreviation: 'LIBRE',
    aliases: ['Alianza LIBRE', 'AL', 'libre', 'LIBRE Bolivia', 'LIBRE Tuto','libre 21'],
    color: '#FFD700',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '4',
      name: 'Jorge Tuto Quiroga',
      photo: '/img/JorgeTutoQuiroga.AlianzaLIBRE.png',
      age: 63,
      experience: { 
        es: 'Ex Presidente de Bolivia (2001-2002)', 
        en: 'Former President of Bolivia (2001-2002)' 
      },
      education: { 
        es: 'Ingeniero Industrial, Texas A&M University', 
        en: 'Industrial Engineer, Texas A&M University' 
      },
      proposals: [
        { es: 'Unidad nacional y reconciliación', en: 'National unity and reconciliation' },
        { es: 'Economía de mercado social', en: 'Social market economy' },
        { es: 'Integración internacional', en: 'International integration' }
      ],
      socials: { threads: 'https://x.com/tutoquiroga?lang=es', facebook: 'https://www.facebook.com/TutoQuiroga/?locale=es_LA', instagram: 'https://www.instagram.com/tutoquiroga/?hl=es', web: 'https://tutoquiroga.com/' }
    }
  },
  {
    id: '5',
    name: 'Partido Demócrata Cristiano',
    abbreviation: 'PDC',
    aliases: ['Partido Demócrata Cristiano', 'PDC', 'PC', 'PDC Bolivia', 'PDC oficial'],
    color: '#8B4513',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '5',
      name: 'Rodrigo Paz Pereira',
      photo: '/img/RodrigoPazPereira.PDC.png',
      age: 52,
      experience: { 
        es: 'Ex Senador', 
        en: 'Former Senator' 
      },
      education: { 
        es: 'Médico, Universidad Mayor de San Andrés', 
        en: 'Medical Doctor, Universidad Mayor de San Andrés' 
      },
      proposals: [
        { es: 'Lucha contra la corrupción', en: 'Fight against corruption' },
        { es: 'Transparencia en la gestión pública', en: 'Transparency in public management' },
        { es: 'Mejora del sistema de salud', en: 'Improvement of the health system' }
      ],
      socials: { threads: 'https://x.com/rodrigo_pazp?lang=es', facebook: 'https://www.facebook.com/RodrigoPazPereira/?locale=es_LA', instagram: 'https://www.instagram.com/rodrigopazpereira/', web: '' }
    }
  },
  {
    id: '6',
    name: 'Libertad y progreso ADN',
    abbreviation: 'ADN',
    aliases: ['LYP-ADN', 'ADN', 'AD', 'ADN Bolivia', 'ADN LYP'],
    color: '#DC2626',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '6',
      name: 'Pavel Aracena',
      photo: '/img/PavelAracena.LYP-ADN.png',
      age: 48,
      experience: { 
        es: 'Ex Diputado', 
        en: 'Former Deputy' 
      },
      education: { 
        es: 'Abogado, Universidad Mayor de San Andrés', 
        en: 'Lawyer, Universidad Mayor de San Andrés' 
      },
      proposals: [
        { es: 'Fortalecimiento de la democracia', en: 'Strengthening democracy' },
        { es: 'Transparencia gubernamental', en: 'Government transparency' },
        { es: 'Desarrollo económico sostenible', en: 'Sustainable economic development' }
      ],
      socials: { threads: 'https://x.com/pavelitoaracena', facebook: 'https://www.facebook.com/pavel.antonio.7/', instagram: 'https://www.instagram.com/pavelaracena2025/', web: '' }
    }
  },
  {
    id: '7',
    name: 'Nueva Generación Patriótica',
    abbreviation: 'NGP',
    aliases: ['NGP', 'Nueva Generación Patriótica', 'NGP Bolivia', 'NGP Jaime Dunn'],
    color: '#F43F5E',
    votes: 0,
    percentage: 0,
    disqualified: true,
    candidate: {
      id: '7',
      name: 'Jaime Dunn',
      photo: '/img/JaimeDunn.NGP.png',
      age: 55,
      experience: { 
        es: 'Ex Ministro', 
        en: 'Former Minister' 
      },
      education: { 
        es: 'Economista, Universidad Católica Boliviana', 
        en: 'Economist, Universidad Católica Boliviana' 
      },
      proposals: [
        { es: 'Nuevo modelo de gobierno', en: 'New government model' },
        { es: 'Innovación tecnológica', en: 'Technological innovation' },
        { es: 'Educación de calidad', en: 'Quality education' }
      ],
      socials: { threads: 'https://x.com/jaimedunn_', facebook: 'https://www.facebook.com/jaimedunndeavila/', instagram: 'https://www.instagram.com/jaimedunn_/?hl=es', web: '' }
    }
  },
  {
    id: '8',
    name: 'La Fuerza del Pueblo',
    abbreviation: 'FP',
    aliases: ['FP', 'Fuerza del Pueblo', 'La Fuerza del Pueblo', 'Fuerza del Pueblo Bolivia', 'UCS', 'UCS Bolivia'],
    color: '#9B59B6',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '8',
      name: 'Max Jhonny Fernández Saucedo',
      photo: '/img/JhonnyFernandez.FP.png',
      age: 60,
      experience: { 
        es: 'Alcalde de Santa Cruz de la Sierra (1995-2000, 2021-presente), Concejal Municipal (1989-1991, 2015-2020), Candidato presidencial 2002, Jefe Nacional de UCS desde 1996', 
        en: 'Mayor of Santa Cruz de la Sierra (1995-2000, 2021-present), Municipal Councilor (1989-1991, 2015-2020), Presidential candidate 2002, National UCS Leader since 1996' 
      },
      education: { 
        es: 'Bachiller en Unidad Educativa Grigotá, Estudios de Electrónica en Buenos Aires', 
        en: 'High School Graduate from Grigotá Educational Unit, Electronics Studies in Buenos Aires' 
      },
      proposals: [
        { es: 'Santa Cruz Digital', en: 'Digital Santa Cruz' },
        { es: 'Modernización municipal', en: 'Municipal modernization' },
        { es: 'Transparencia y auditoria de procesos', en: 'Transparency and process auditing' }
      ],
      socials: { 
        threads: '', 
        facebook: 'https://www.facebook.com/jhonny.fernandezd', 
        instagram: 'https://www.instagram.com/jhonnyfernandezs/', 
        web: '' 
      }
    }
  },
  {
    id: '9',
    name: 'Movimiento de Renovación Nacional',
    abbreviation: 'MORENA',
    aliases: ['MORENA', 'Movimiento de Renovación Nacional', 'MORENA Bolivia', 'MORENA Mónica Eva Copa'],
    color: '#E67E22',
    votes: 0,
    percentage: 0,
    withdrawalType: 'withdrawn',
    candidate: {
      id: '9',
      name: 'Mónica Eva Copa Murga',
      photo: '/img/EvaCopa.Morena.png',
      age: 37,
      experience: { 
        es: 'Alcaldesa de El Alto (2021-presente), Presidenta del Senado de Bolivia (2019-2020), Senadora por La Paz (2015-2020), Ex dirigente universitaria FUL El Alto', 
        en: 'Mayor of El Alto (2021-present), President of the Senate of Bolivia (2019-2020), Senator for La Paz (2015-2020), Former university leader FUL El Alto' 
      },
      education: { 
        es: 'Licenciada en Trabajo Social, Universidad Pública de El Alto (UPEA) - 2011, Bachiller Colegio Luis Espinal Camps', 
        en: 'Bachelor in Social Work, Universidad Pública de El Alto (UPEA) - 2011, High School Graduate from Luis Espinal Camps College' 
      },
      proposals: [
        { es: 'Desarrollo urbano sostenible', en: 'Sustainable urban development' },
        { es: 'Derechos de la juventud y la mujer', en: 'Youth and women rights' },
        { es: 'Modernización municipal y transparencia', en: 'Municipal modernization and transparency' }
      ],
      socials: { 
        threads: '', 
        facebook: '', 
        instagram: '', 
        web: '' 
      }
    }
  },
  {
    id: '10',
    name: 'Frente de Unidad Nacional',
    abbreviation: 'UN',
    aliases: ['UN', 'Frente de Unidad Nacional', 'UN Bolivia', 'UN Samuel Doria Medina'],
    color: '#1ABC9C',
    votes: 0,
    percentage: 0,
    candidate: {
      id: '10',
      name: 'Samuel Doria Medina Auza',
      photo: '/img/SamuelDoriaMedina.BloqueDeUnidad.png',
      age: 66,
      experience: { 
        es: 'Presidente del Frente de Unidad Nacional (2003-2021), Ministro de Planificación y Coordinación (1991-1993), Ex Presidente de SOBOCE (1987-2014), Candidato presidencial 2005, 2009, 2014', 
        en: 'President of the National Unity Front (2003-2021), Minister of Planning and Coordination (1991-1993), Former President of SOBOCE (1987-2014), Presidential candidate 2005, 2009, 2014' 
      },
      education: { 
        es: 'Doctorado en Economía con especialidad en Finanzas Públicas - London School of Economics, Maestría en Economía - Universidad Estatal de Arizona, Economía y Administración de Empresas - Universidad Católica Boliviana', 
        en: 'PhD in Economics with specialization in Public Finance - London School of Economics, Master in Economics - Arizona State University, Economics and Business Administration - Universidad Católica Boliviana' 
      },
      proposals: [
        { es: 'Tercera vía política moderada', en: 'Moderate political third way' },
        { es: 'Desarrollo económico empresarial', en: 'Business economic development' },
        { es: 'Unidad nacional y consenso', en: 'National unity and consensus' }
      ],
      socials: { 
        threads: '', 
        facebook: '', 
        instagram: '', 
        web: 'https://samuel.bo' 
      }
    }
  }
];

