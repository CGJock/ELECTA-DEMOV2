import pool from './db.js';

export async function insertParties(): Promise<void> {
  try {
    const parties = [
      { id: 1, abbr: 'AP', name: 'Alianza Popular'},
      { id: 2, abbr: 'ADN', name: 'Accion Democratica Nacionalista'},
      { id: 3, abbr: 'APB-SUMATE', name: 'Autonomia Para Bolivia'},
      { id: 4, abbr: 'NGP', name: 'Nueva Generacion Patriotica'},
      { id: 5, abbr: 'LIBRE', name: 'Alianza Libre'},
      { id: 6, abbr: 'FP', name: 'Alianza Fuerza Del Pueblo' },
      { id: 7, abbr: 'MAS-IPSP', name: 'Movimiento Al Socialismo Instrumeto Politico Por La Soberania De Los Pueblos'},
      { id: 8, abbr: 'MORENA' , name: 'Movimiento De Renovacion Nacional'},
      { id: 9, abbr: 'UN', name: 'Unidad Nacional'},
      { id: 10, abbr: 'PDC', name: 'Partido Democrata Cristiano'}
      ];
    for (const party of parties) {
      await pool.query(
        'INSERT INTO political_parties (id, abbr, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [party.id, party.abbr, party.name]
      );
    }
     console.log('Departamentos insertados correctamente');
  } catch (error) {
    console.error('Error insertando departamentos:', error);
  }
}


