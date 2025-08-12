import xlsx from 'xlsx';

export interface Municipality {
  name: string;
  code: string;
  province_code: string;
}

export function readMunicipalitiesFromExcel(filePath: string): Municipality[] {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets['bol_admgz_adm3'];

  if (!sheet) {
    throw new Error('❌ Sheet "bol_admgz_adm3" not found');
  }

  const data: Record<string, any>[] = xlsx.utils.sheet_to_json(sheet);

  const municipalities: Municipality[] = [];

  const seen = new Set(); // Avoid duplicates

  for (const row of data) {
    const name = row['ADM3_ES'];
    const code = row['ADM3_PCODE'];
    const province_code = row['ADM2_PCODE']

    if (name && code && province_code && !seen.has(code)) {
      municipalities.push({ name, code, province_code });
      seen.add(code);
    }
  }

  return municipalities;
}
