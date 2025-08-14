import pool from '@db/db.js';
// import { createFirstAdmin } from './createFirstAdmin.js';

export async function initTables(): Promise<void> {
  const queries = [
    {
      name: 'departments',
      sql: `
        CREATE TABLE IF NOT EXISTS departments (
           id SERIAL UNIQUE,
          code TEXT PRIMARY KEY,
          name TEXT NOT NULL
        );
      `
    },
    {
      name: 'provinces',
      sql: `
        CREATE TABLE IF NOT EXISTS provinces (
           id SERIAL UNIQUE,
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
          id SERIAL UNIQUE,
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
          country TEXT NOT NULL DEFAULT 'NOT COUNTRY',
          year INT CHECK (year >= 1000 AND year <= 9999),
          UNIQUE (election_type, country, year)
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
      name: 'active_election',
      sql: `
        CREATE TABLE IF NOT EXISTS active_election (
          id SERIAL PRIMARY KEY,
          election_round_id INT NOT NULL REFERENCES election_rounds(id),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    },
    {
      name: 'ballot_tallies',
      sql: `
        CREATE TABLE IF NOT EXISTS ballot_tallies (
          id SERIAL UNIQUE,
          project_id TEXT,
          project_name TEXT,
          date_start_time TIMESTAMP,
          date_time_complete TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          verification_code NUMERIC(10,3) PRIMARY KEY,
          election_round_id INTEGER NOT NULL REFERENCES election_rounds(id),
          department_code VARCHAR NOT NULL REFERENCES departments(code),
          image_url TEXT NOT NULL,
          raw_data JSONB NOT NULL
        );
      `
    },
    {
      name: 'ballots_data',
      sql: `
      CREATE TABLE IF NOT EXISTS ballots_data (
      id SERIAL unique,
      project_id TEXT,
      project_name TEXT,
      date_start_time TIMESTAMP,
      date_time_complete TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verification_code NUMERIC(10,3) UNIQUE NOT NULL,
      election_round_id INT NOT NULL REFERENCES election_rounds(id) ON DELETE CASCADE,
      department_code TEXT NOT NULL REFERENCES departments(code),
      image_url TEXT,
      raw_data JSONB NOT NULL
      );
   `
    },
    {
      name: 'ballots_missing_data',
      sql: `
      CREATE TABLE IF NOT EXISTS ballots_missing_data (
      id SERIAL unique,
      project_id TEXT,
      project_name TEXT,
      date_start_time TIMESTAMP,
      date_time_complete TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verification_code NUMERIC(10,3) UNIQUE NOT NULL,
      election_round_id INT NOT NULL REFERENCES election_rounds(id) ON DELETE CASCADE,
      department_code TEXT NOT NULL REFERENCES departments(code),
      image_url TEXT,
      raw_data JSONB NOT NULL
      );
   `
    },
    //  {
    //   name: 'votes_data_tallies',
    //   sql: `
    //     CREATE TABLE IF NOT EXISTS votes_data_tallies (
    //     id SERIAL PRIMARY KEY,
    //     verification_code NUMERIC NOT NULL REFERENCES ballot_tallies(verification_code),
    //     party_name TEXT DEFAULT 'UNDEFINED',
    //     party_vote_count INTEGER DEFAULT NULL,
    //     UNIQUE (verification_code, party_name)
    //   );
    //   `
    // },
    // {
    //   name: 'votes',
    //   sql: `
    //     CREATE TABLE IF NOT EXISTS votes (
    //       id SERIAL PRIMARY KEY,
    //       election_round_id INT NOT NULL UNIQUE REFERENCES election_rounds(id),
    //       valid_votes INT DEFAULT 0,
    //       blank_votes INT DEFAULT 0,
    //       null_votes INT DEFAULT 0,
    //       expected_votes INT DEFAULT 0
    //     );
    //   `
    // },
    {
      name: 'political_parties',
      sql: `
        CREATE TABLE IF NOT EXISTS political_parties (
          id SERIAL PRIMARY KEY,
          abbr TEXT NOT NULL UNIQUE,
          name TEXT,
          color TEXT,
          logo_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'presidential_votes',
      sql: `
        CREATE TABLE IF NOT EXISTS presidential_votes (
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
      name: 'deputy_votes',
      sql: `
        CREATE TABLE IF NOT EXISTS deputy_votes (
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
    },
    {
      name: 'component_visibility',
      sql: `
        CREATE TABLE IF NOT EXISTS component_visibility (
          id SERIAL PRIMARY KEY,
          phase_name TEXT NOT NULL UNIQUE,
          phase_display_name TEXT NOT NULL,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'phase_components',
      sql: `
        CREATE TABLE IF NOT EXISTS phase_components (
          id SERIAL PRIMARY KEY,
          phase_id INTEGER NOT NULL REFERENCES component_visibility(id) ON DELETE CASCADE,
          component_name TEXT NOT NULL,
          component_display_name TEXT NOT NULL,
          is_visible BOOLEAN DEFAULT true,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(phase_id, component_name)
        );
      `
    },
    {
      name: 'component_visibility_index',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_component_visibility_phase_name ON component_visibility(phase_name);
        CREATE INDEX IF NOT EXISTS idx_component_visibility_is_active ON component_visibility(is_active);
      `
    },
    {
      name: 'phase_components_index',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_phase_components_phase_id ON phase_components(phase_id);
        CREATE INDEX IF NOT EXISTS idx_phase_components_component_name ON phase_components(component_name);
      `
    },
    {
      name: 'whitelist_users',
      sql: `
        CREATE TABLE IF NOT EXISTS whitelist_users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'denied', 'pending')),
          notes TEXT,
          created_by INTEGER REFERENCES admins(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'whitelist_users_index',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_whitelist_users_email ON whitelist_users(email);
        CREATE INDEX IF NOT EXISTS idx_whitelist_users_status ON whitelist_users(status);
      `
    },
    {
      name: 'admins',
      sql: `
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          email TEXT,
          full_name TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'admins_index',
      sql: `
        CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
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
  // await createFirstAdmin();
}
