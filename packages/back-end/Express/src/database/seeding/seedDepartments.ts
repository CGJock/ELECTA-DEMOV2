import { readDeparmentsFromExcel } from '@utils/readDepartments.js';
import pool from '@db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedDepartments(): Promise<void> {
  const filePath = path.join(__dirname, '../../../data/bol_admgz.xls');
  const departments = readDeparmentsFromExcel(filePath);

  for (const department of departments) {
    await pool.query(
      'INSERT INTO departments (name, code) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
      [department.name, department.code]
    );
  }

  console.log('✅ departments inserted.');
}