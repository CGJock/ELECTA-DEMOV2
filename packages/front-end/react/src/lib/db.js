import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function initDB() {
  const db = await open({
    filename: path.join('./votes.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS locations  (
      id INTEGER PRIMARY KEY, 
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS parties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      abbr TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER,
      party_id INTEGER,
      null_vote BOOLEAN,
      blank_vote BOOLEAN,
      FOREIGN KEY (location_id) REFERENCES locations(id),
      FOREIGN KEY (party_id) REFERENCES parties(id)
    );
  
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo TEXT NOT NULL,
      age INTEGER NOT NULL,
      party_id INTEGER NOT NULL,
      experience TEXT NOT NULL,
      education TEXT NOT NULL,
      color TEXT NOT NULL,
      votes INTEGER NOT NULL,
      percentage REAL NOT NULL,
      FOREIGN KEY (party_id) REFERENCES parties(id)
    );

    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER NOT NULL,
      FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    );

    CREATE TABLE IF NOT EXISTS proposal_texts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proposal_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      language TEXT NOT NULL,
      FOREIGN KEY (proposal_id) REFERENCES proposals(id)
    );
  
  `);

  const [{ count: locationCount }] = await db.all(`SELECT COUNT(*) as count FROM locations`);
  const [{ count: partyCount }] = await db.all(`SELECT COUNT(*) as count FROM parties`);

  if (locationCount === 0) {
    await db.run(`
      INSERT INTO locations (id, name) VALUES 
      (1, 'La Paz'), 
      (2, 'Oruro'),
      (3, 'Potosí'),
      (4, 'Tarija'),
      (5, 'Santa Cruz'),
      (6, 'Chuquisaca'),
      (7, 'Pando'), 
      (8, 'El Beni'), 
      (9, 'Cochabamba')
    `);
  }

  if (partyCount === 0) {
    await db.run(`
      INSERT INTO parties (name, abbr) VALUES 
      ('MAS-IPSP', 'MAS'), 
      ('Alianza Popular', 'AP'), 
      ('Frente Popular', 'FP'), 
      ('Alianza LIBRE', 'LIBRE'),
      ('Partido Demócrata Cristiano', 'PDC'),
      ('LYP-ADN', 'LYP-ADN'),
      ('NGP', 'NGP')
    `);
  }

  const [{ count: candidateCount }] = await db.all(`SELECT COUNT(*) as count FROM candidates`);

  if (candidateCount === 0) {
    const mockData = [
      {
        party_id: 1,
        color: '#FF6B35',
        candidate: {
          name: 'Eduardo Castillo',
          photo: '/img/EduardoCastillo.MAS-IPSP.png',
          age: 45,
          experience: 'Ex Ministro de Economía y Finanzas Públicas',
          education: 'Economista, Universidad Mayor de San Andrés',
          proposals: [
            'Continuar con el modelo económico social comunitario',
            'Fortalecer la industrialización',
            'Mantener la soberanía nacional'
          ]
        }
      },
      {
        party_id: 2,
        color: '#4A90E2',
        candidate: {
          name: 'Andrónico Rodríguez',
          photo: '/img/AndrónicoRodríguez.AlianzaPopular.png',
          age: 35,
          experience: 'Ex Senador',
          education: 'Ingeniero, Universidad Mayor de San Andrés',
          proposals: [
            'Recuperar la democracia y las instituciones',
            'Promover la inversión privada',
            'Mejorar las relaciones internacionales'
          ]
        }
      },
      {
        party_id: 3,
        color: '#50C878',
        candidate: {
          name: 'Jhonny Fernández',
          photo: '/img/JhonnyFernandez.FP.png',
          age: 44,
          experience: 'Ex Gobernador de Santa Cruz',
          education: 'Abogado, Universidad Católica Boliviana',
          proposals: [
            'Descentralización y autonomías',
            'Libre mercado y emprendimiento',
            'Seguridad ciudadana'
          ]
        }
      },
      {
        party_id: 4,
        color: '#FFD700',
        candidate: {
          name: 'Jorge Tuto Quiroga',
          photo: '/img/JorgeTutoQuiroga.AlianzaLIBRE.png',
          age: 63,
          experience: 'Ex Presidente de Bolivia (2001-2002)',
          education: 'Ingeniero Industrial, Texas A&M University',
          proposals: [
            'Unidad nacional y reconciliación',
            'Economía de mercado social',
            'Integración internacional'
          ]
        }
      },
      {
        party_id: 5,
        color: '#8B4513',
        candidate: {
          name: 'Rodrigo Paz Pereira',
          photo: '/img/RodrigoPazPereira.PDC.png',
          age: 52,
          experience: 'Ex Senador',
          education: 'Médico, Universidad Mayor de San Andrés',
          proposals: [
            'Lucha contra la corrupción',
            'Transparencia en la gestión pública',
            'Mejora del sistema de salud'
          ]
        }
      },
      {
        party_id: 6,
        color: '#DC2626',
        candidate: {
          name: 'Pavel Aracena',
          photo: '/img/PavelAracena.LYP-ADN.png',
          age: 48,
          experience: 'Ex Diputado',
          education: 'Abogado, Universidad Mayor de San Andrés',
          proposals: [
            'Fortalecimiento de la democracia',
            'Transparencia gubernamental',
            'Desarrollo económico sostenible'
          ]
        }
      },
      {
        party_id: 7,
        color: '#F43F5E',
        candidate: {
          name: 'Jaime Dunn',
          photo: '/img/JaimeDunn.NGP.png',
          age: 55,
          experience: 'Ex Ministro',
          education: 'Economista, Universidad Católica Boliviana',
          proposals: [
            'Nuevo modelo de gobierno',
            'Innovación tecnológica',
            'Educación de calidad'
          ]
        }
      }
    ];

    for (const entry of mockData) {
      const { party_id, color, candidate } = entry;

      // Insert candidate
      const result = await db.run(
        `INSERT INTO candidates (name, photo, age, party_id, experience, education, color, votes, percentage)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
        candidate.name,
        candidate.photo,
        candidate.age,
        party_id,
        candidate.experience,
        candidate.education,
        color
      );

      const candidateId = result.lastID;

      // Insert candidate proposals
      for (const proposal of candidate.proposals) {
        // Traducciones profesionales y naturales al inglés para cada propuesta
        const translations = {
          // Eduardo Castillo
          'Continuar con el modelo económico social comunitario': 'Continue with the social community-based economic model',
          'Fortalecer la industrialización': 'Strengthen industrialization',
          'Mantener la soberanía nacional': 'Maintain national sovereignty',

          // Andrónico Rodríguez
          'Recuperar la democracia y las instituciones': 'Restore democracy and institutions',
          'Promover la inversión privada': 'Promote private investment',
          'Mejorar las relaciones internacionales': 'Improve international relations',

          // Jhonny Fernández
          'Descentralización y autonomías': 'Decentralization and regional autonomy',
          'Libre mercado y emprendimiento': 'Free market and entrepreneurship',
          'Seguridad ciudadana': 'Public safety',

          // Jorge Tuto Quiroga
          'Unidad nacional y reconciliación': 'National unity and reconciliation',
          'Economía de mercado social': 'Social market economy',
          'Integración internacional': 'International integration',

          // Rodrigo Paz Pereira
          'Lucha contra la corrupción': 'Fight against corruption',
          'Transparencia en la gestión pública': 'Transparency in public administration',
          'Mejora del sistema de salud': 'Improve the healthcare system',

          // Pavel Aracena
          'Fortalecimiento de la democracia': 'Strengthen democracy',
          'Transparencia gubernamental': 'Government transparency',
          'Desarrollo económico sostenible': 'Sustainable economic development',

          // Jaime Dunn
          'Nuevo modelo de gobierno': 'New model of government',
          'Innovación tecnológica': 'Technological innovation',
          'Educación de calidad': 'Quality education',
        };
        // Primero insertamos la propuesta (sin texto)
        const proposalResult = await db.run(
          `INSERT INTO proposals (candidate_id) VALUES (?)`,
          candidateId
        );
        const proposalId = proposalResult.lastID;
        // Insertar en español
        await db.run(
          `INSERT INTO proposal_texts (proposal_id, text, language) VALUES (?, ?, ?)`,
          proposalId,
          proposal,
          'es'
        );
        // Insertar en inglés
        await db.run(
          `INSERT INTO proposal_texts (proposal_id, text, language) VALUES (?, ?, ?)`,
          proposalId,
          translations[proposal] || proposal,
          'en'
        );
      }
    }
  }

  return db;
}

// Obtener los textos de propuestas de un candidato en un idioma específico
export async function getProposalsByCandidate(db, candidateId, language = 'es') {
  console.log('[DB] getProposalsByCandidate llamado con candidateId:', candidateId, 'y language:', language);
  const rows = await db.all(
    `SELECT pt.text
     FROM proposals p
     JOIN proposal_texts pt ON pt.proposal_id = p.id
     WHERE p.candidate_id = ? AND pt.language = ?`,
    candidateId,
    language
  );
  console.log('[DB] Resultados de la consulta de propuestas:', rows);
  return rows.map(row => row.text);
}

