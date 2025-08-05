import { z } from 'zod';

//function that deletes letters and spacers from a string
export const cleanNumberField = (fieldName: string) =>
  z.preprocess(
    (val) => {
      if (typeof val === 'number') {
        return val === -1 ? 0 : val;
      }

      if (typeof val === 'string') {
        const trimmed = val.trim();

        if (trimmed === '-1') return 0;

        const cleaned = trimmed.replace(/[^\d]/g, '');
        const num = Number(cleaned);

        return isNaN(num) ? undefined : num;
      }

      return undefined;
    },
    z.number()
  ).refine(
    (num) => typeof num === 'number' && !isNaN(num),
    {
      message: `Field '${fieldName}' must be a valid number.`,
    }
  );


//function that formats a date
export const cleanDateField = (fieldName: string) =>
  z
    .string()
    .refine((val) => {
      const parsed = parseFlexibleDate(val);
      return parsed instanceof Date && !isNaN(parsed.getTime());
    }, {
      message: `Campo ${fieldName} no es una fecha válida.`,
    })
    .transform((val) => parseFlexibleDate(val));

function parseFlexibleDate(val: string): Date {
  // Caso: ISO o reconocible por Date
  const isoParsed = new Date(val);
  if (!isNaN(isoParsed.getTime())) return isoParsed;

  // Caso: Format like "20250714100000000"
  if (/^\d{17}$/.test(val)) {
    const year = val.slice(0, 4);
    const month = val.slice(4, 6);
    const day = val.slice(6, 8);
    const hour = val.slice(8, 10);
    const min = val.slice(10, 12);
    const sec = val.slice(12, 14);

    const formatted = `${year}-${month}-${day}T${hour}:${min}:${sec}`;
    const customParsed = new Date(formatted);
    if (!isNaN(customParsed.getTime())) return customParsed;
  }

  return new Date('invalid'); 
}