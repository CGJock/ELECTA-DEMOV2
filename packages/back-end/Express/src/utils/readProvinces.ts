import xlsx from 'xlsx';

export interface Province {
  name: string;
  code: string;
  department_code: string
}

export function readProvincesFromExcel(filePath: string): Province[] {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets['bol_admgz_adm2'];

  if (!sheet) {
    throw new Error('❌ Sheet "bol_admgz_adm2" not found');
  }

  const data: Record<string, any>[] = xlsx.utils.sheet_to_json(sheet);

  const provinces: Province[] = [];

  const seen = new Set(); // Avoid duplicates

  for (const row of data) {
    const name = row['ADM2_ES'];
    const code = row['ADM2_PCODE'];
    const department_code = row['ADM1_PCODE']

    if (name && code && department_code && !seen.has(code)) {
      provinces.push({ name, code, department_code });
      seen.add(code);
    }
  }

  return provinces;
}
