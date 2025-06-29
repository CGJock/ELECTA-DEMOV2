import pool from './db.js';

export async function insertCandidates(): Promise<void> {
  try {
    const candidates = [
      { id: 1, name: 'Andrónico Rodríguez'},
      { id: 2, name: 'Pablo Folster'},
      { id: 3, name: 'Manfred Reyes Villa'},
      { id: 4, name: 'Jaime Dunn'},
      { id: 5, name: 'Jorge Tuto Quiroga'},
      { id: 6, name: 'Jhonny Fernández'},
      { id: 7, name: 'Eduardo Castillo'},
      { id: 8, name: 'Eva Copa' },
      { id: 9, name: 'Samuel Doria Medina'},
      { id: 10, name: 'Rodrigo Paz Pereira'}
      ];
    for (const candidate of candidates) {
      await pool.query(
        'INSERT INTO candidates (id, name) VALUES ($1,$2) ON CONFLICT (id) DO NOTHING',
        [ candidate.id, candidate.name ]
      );
    }
     console.log('Departamentos insertados correctamente');
  } catch (error) {
    console.error('Error insertando departamentos:', error);
  }
}
