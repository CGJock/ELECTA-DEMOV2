import pool from '@db/db.js';

export async function seedElectionTypes(): Promise<void> {
  try {
    //election type 1 for generals 
    await pool.query(
        `
        INSERT INTO election_types (type_id, name_type)
        VALUES ($1, $2)
        ON CONFLICT (name_type) DO NOTHING;
      `,
        [1, 'GENERALES']
        );
     console.log('election_type succesfully inserted');
  } catch (error) {
    console.error('Error insertando name_type:', error);
  } 
}