import pool from '@db/db.js';

export async function insertElection(): Promise<void> {
  try {
    //inserts the type of election + year of election
    const year_of_election = 2025
    await pool.query(
        `
        INSERT INTO elections (election_type, year)
        VALUES ($1,$2)
      `,
        [1, year_of_election]
        );
     console.log('Election succesfully inserted');
  } catch (error) {
    console.error('Error insertando election en seeder:', error);
  } 
}