import pool from '@db/db.js';

export async function initTables(): Promise<void> {
  const queries = [
    {
      name: 'departments',
      sql: `
        CREATE TABLE IF NOT EXISTS departments (
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL
        );
      `
    },
    {
      name: 'provinces',
      sql: `
        CREATE TABLE IF NOT EXISTS provinces (
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          department_code TEXT NOT NULL REFERENCES departments(code) ON DELETE CASCADE
        );
      `
    },
    {
      name: 'municipalities',
      sql: `
        CREATE TABLE IF NOT EXISTS municipalities (
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          province_code TEXT NOT NULL REFERENCES provinces(code) ON DELETE CASCADE
        );
      `
    },
    {
      name: 'election_types',
      sql: `
        CREATE TABLE IF NOT EXISTS election_types (
          id SERIAL UNIQUE,
          type_id INT PRIMARY KEY,
          name_type TEXT NOT NULL UNIQUE
        );
      `
    },
    {
      name: 'elections',
      sql: `
        CREATE TABLE IF NOT EXISTS elections (
          id SERIAL PRIMARY KEY,
          election_type INT NOT NULL REFERENCES election_types(type_id),
          year INT CHECK (year >= 1000 AND year <= 9999)
        );
      `
    },
    {
      name: 'election_rounds',
      sql: `
        CREATE TABLE IF NOT EXISTS election_rounds (
          id SERIAL PRIMARY KEY,
          election_id INT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
          round_number INT NOT NULL CHECK (round_number IN (1, 2)),
          round_date DATE NOT NULL,
          UNIQUE (election_id, round_number)
        );
      `
    },
    {
      name: 'ballot_tallies',
      sql: `
        CREATE TABLE IF NOT EXISTS ballot_tallies (
          id SERIAL PRIMARY KEY,
          election_round_id INTEGER NOT NULL REFERENCES election_rounds(id),
          department_code VARCHAR NOT NULL REFERENCES departments(code),
          image_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'votes',
      sql: `
        CREATE TABLE IF NOT EXISTS votes (
          id SERIAL PRIMARY KEY,
          election_round_id INT NOT NULL UNIQUE REFERENCES election_rounds(id),
          valid_votes INT DEFAULT 0,
          blank_votes INT DEFAULT 0,
          null_votes INT DEFAULT 0,
          expected_votes INT DEFAULT 0
        );
      `
    },
     {
      name: 'political_parties',
      sql: `
        CREATE TABLE IF NOT EXISTS political_parties (
          id SERIAL PRIMARY KEY,
          election_round_id INT UNIQUE REFERENCES election_rounds(id) ON DELETE CASCADE,
          name TEXT DEFAULT 'UNDEFINED',
          abbr TEXT DEFAULT 'UNDEFINED'
        );
      `
    },
    {
      name: 'department_votes',
      sql: `
        CREATE TABLE IF NOT EXISTS department_votes (
          id SERIAL PRIMARY KEY,
          election_round_id INT NOT NULL REFERENCES election_rounds(id) ON DELETE CASCADE,
          department_code TEXT NOT NULL REFERENCES departments(code) ON DELETE CASCADE,
          party_id INT NOT NULL REFERENCES political_parties(id) ON DELETE CASCADE,
          votes INT DEFAULT 0,
          UNIQUE (election_round_id, department_code, party_id)
        );
      `
    },
    {
      name: 'uninominal_deputies_votes',
      sql: `
        CREATE TABLE IF NOT EXISTS uninominal_deputies_votes (
          id SERIAL PRIMARY KEY,
          election_round_id INT NOT NULL REFERENCES election_rounds(id),
          department_code TEXT NOT NULL REFERENCES departments(code) ON DELETE CASCADE,
          party_id INT NOT NULL REFERENCES political_parties(id) ON DELETE CASCADE,
          votes INT DEFAULT 0,
          UNIQUE (election_round_id, department_code, party_id)
        );
      `
    },
    {
      name: 'plurinominal_deputies_votes',
      sql: `
        CREATE TABLE IF NOT EXISTS plurinominal_deputies_votes (
          id SERIAL PRIMARY KEY,
          election_round_id INT NOT NULL REFERENCES election_rounds(id),
          department_code TEXT NOT NULL REFERENCES departments(code) ON DELETE CASCADE,
          party_id INT NOT NULL REFERENCES political_parties(id) ON DELETE CASCADE,
          votes INT DEFAULT 0,
          UNIQUE (election_round_id, department_code, party_id)
        );
      `
    },
    {
      name: 'newsletter_mails',
      sql: `
        CREATE TABLE IF NOT EXISTS newsletter_mails (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE
        );
      `
    }
  ];

  for (const query of queries) {
    try {
      await pool.query(query.sql);
      console.log(`Tabla '${query.name}' verificada o creada.`);
    } catch (error) {
      console.error(`Error al crear tabla '${query.name}':`, (error as Error).message);
    }
  }
}
