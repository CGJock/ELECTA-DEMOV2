import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export async function ensureDatabase(): Promise<void> {
  const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: 'postgres', // base existente para crear otras
  });

  await client.connect();

  const electaDB = process.env.PG_DATABASE;

  const res = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [electaDB]
  );

  if (res.rowCount === 0) {
    console.log(`Base '${electaDB}' no existe. Creando...`);
    await client.query(`CREATE DATABASE ${electaDB}`);
    console.log(`Base '${electaDB}' creada.`);
  } else {
    console.log(`Base '${electaDB}' ya existe.`);
  }

  await client.end();
}
