import pool from './db.js';

export async function initTables(): Promise<void> {
  try {
    //Creation of table departments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    console.log("Tabla 'departments' verificada o creada.");
  } catch (error) {
    console.error('Error al crear tablas:', (error as Error).message);
  }

  try {
    //Creation of table votes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY,
      valid_votes INT DEFAULT 0,
      blank_votes INT DEFAULT 0,
      null_votes INT DEFAULT 0
      );
    `);
    } catch (error) {
      console.error('Error al crear tablas:', (error as Error).message)
    }

  try{
    //Creation of table candidates
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
      );
      `)
  } catch (error) {
    console.error('Error al crear tablas:', (error as Error).message);
  }

   try{
    //Creation of table political_parties
    await pool.query(`
      CREATE TABLE IF NOT EXISTS political_parties (
      id INT PRIMARY KEY,
      name TEXT NOT NULL,
      abbr TEXT NOT NULL,
      pres_candidate INT UNIQUE NULL REFERENCES candidates(id) ON DELETE SET NULL
      );
      `)
  } catch (error) {
    console.error('Error al crear tablas:', (error as Error).message);
  }

  try{
    //Creation of table departments_votes will show the rows for each departemnt and the votes for each party in specific department
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments_votes (
      id SERIAL PRIMARY KEY,
      department_id INT REFERENCES departments(id) ON DELETE CASCADE,
      party_id INT REFERENCES political_parties(id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      UNIQUE (department_id, party_id)
      );
      `)
  } catch (error) {
    console.error('Error al crear tablas:', (error as Error).message);
  }

   try{
    //Creation of table newlatter_mails to stored user mails for newsletter
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_mails (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL
      );
      `)
  } catch (error) {
    console.error('Error al crear tablas:', (error as Error).message);
  }

}


