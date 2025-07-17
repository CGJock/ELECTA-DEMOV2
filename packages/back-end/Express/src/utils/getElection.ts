// utils/getElection.ts

import pool from '@db/db.js';
export async function getOrCreateElection(electionType: number, year: number): Promise<number | null> {
  try {
    const existing = await pool.query(
      `SELECT id FROM elections WHERE election_type = $1 AND year = $2 LIMIT 1`,
      [electionType, year]
    );

    if (existing.rows.length > 0) return existing.rows[0].id;

    // Insertar si no existe
    const insert = await pool.query(
      `INSERT INTO elections (election_type, year) VALUES ($1, $2) RETURNING id`,
      [electionType, year]
    );

    return insert.rows[0].id;
  } catch (err) {
    console.error('Error al obtener o crear la elección:', err);
    return null;
  }
}