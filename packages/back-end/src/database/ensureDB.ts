import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export async function ensureDatabase(): Promise<void> {
  const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PGADMIN_USER,
    password: process.env.PGADMIN_PASSWORD,
    database: 'postgres', // base existente para crear otras
  });

  await client.connect();

  const electa_db = process.env.PG_DATABASE;

  const res = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [electa_db]
  );

  if (res.rowCount === 0) {
    console.log(`Base '${electa_db}' no existe. Creando...`);
    await client.query(`CREATE DATABASE ${electa_db}`);
    console.log(`Base '${electa_db}' creada.`);
  } else {
    console.log(`Base '${electa_db}' ya existe.`);
  }

  await client.end();
}
