import { readProvincesFromExcel } from '@utils/readProvinces.js'
import pool from '@db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedProvinces(): Promise<void> {
  const filePath = path.join(__dirname, '../../../data/bol_admgz.xls');
  const provinces = readProvincesFromExcel(filePath);

  for (const province of provinces) {
    await pool.query(
      'INSERT INTO provinces (name, code, department_code ) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
      [province.name, province.code, province.department_code]
    );
  }

  console.log('✅ province inserted.');
  
}

