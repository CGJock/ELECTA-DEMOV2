import pool from './db.js';

export async function insertDepartments(): Promise<void> {
  try {
    const departments = [
      { id: 1, name: 'La Paz'},
      { id: 2, name: 'Oruro'},
      { id: 3, name: 'Potosí'},
      { id: 4, name: 'Tarija'},
      { id: 5, name: 'Santa Cruz'},
      { id: 6, name: 'Chuquisaca' },
      { id: 7, name: 'Pando'},
      { id: 8, name: 'El Beni'},
      { id: 9, name: 'Cochabamba'},
      
    ];
    for (const department of departments) {
      await pool.query(
        'INSERT INTO departments (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [department.id, department.name]
      );
    }

    console.log('Departments succesfully inserted');
  } catch (error) {
    console.error('Error inserting departments:', error);
  }
}


