import { readMunicipalitiesFromExcel } from '@utils/readMunicipalities.js';
import  pool  from '../db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedMunicipalities(): Promise<void> {
  const filePath = path.join(__dirname, '../../../data/bol_admgz.xls');
  const municipalities = readMunicipalitiesFromExcel(filePath);

  for (const municipality of municipalities) {
    await pool.query(
      'INSERT INTO municipalities (name, code, province_code) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
      [municipality.name, municipality.code, municipality.province_code]
    );
  }

  console.log('municipalities inserted.');
  
}

