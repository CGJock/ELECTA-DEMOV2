import xlsx from 'xlsx';

export interface Department {
  name: string;
  code: string;
}

//extracts information froma xls file  in the sheet one with departments to be stored in the database later
export function readDeparmentsFromExcel(filePath: string): Department[] {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets['bol_admgz_adm1'];

  if (!sheet) {
    throw new Error('❌ Sheet "bol_admgz_adm1" not found');
  }

  const data: Record<string, any>[] = xlsx.utils.sheet_to_json(sheet);

  const departments : Department[] = [];

  const seen = new Set(); // Avoid duplicates

  for (const row of data) {
    const name = row['ADM1_ES'];
    const code = row['ADM1_PCODE'];

    if (name && code && !seen.has(code)) {
      departments.push({ name, code });
      seen.add(code);
    }
  }

  return departments;
}
