import { PartyData } from "../types/PartyData.js";
import { fieldAliasMap } from "@configuration/fieldAliasMap.js";
import { IGNORE_KEYS } from "@configuration/fieldAliasMap.js";

export function normalizeBody(rawBody: Record<string, any>) {
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(rawBody)) {
    const trimmedKey = key.trim();
    const mappedKey = fieldAliasMap[trimmedKey] || trimmedKey;
    normalized[mappedKey] = value;
  }
  return normalized;
}

export function extractPartyVotes(body: Record<string, any>): PartyData[] {
  const partyVotes: PartyData[] = [];

  for (const [key, value] of Object.entries(body)) {
    // Ignorar claves que no son partidos
    if (IGNORE_KEYS.includes(key)) continue;

    const abbr = key.trim().toUpperCase();

    // Verificamos si ya existe un partido con ese abbr
    const alreadyExists = partyVotes.some(p => p.abbr === abbr);
    if (alreadyExists) continue;

    if (value === undefined || value === null) {
      // Valor no existe, guardar votes null
      partyVotes.push({ abbr, votes: "error" });
      continue;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();

      if (trimmed === '-1') {
        // Valor de error -1, guardar como string 'error'
        partyVotes.push({ abbr, votes: 'error' });
        continue;
      }

      const cleaned = trimmed.replace(/[^\d]/g, '');
      const num = Number(cleaned);

      if (!isNaN(num)) {
        partyVotes.push({ abbr, votes: num });
      } else {
        // Si no es número válido, igual guardamos null para control
        partyVotes.push({ abbr, votes: null });
      }
    } else {
      // Si el valor no es string, lo ponemos como null para evitar errores
      partyVotes.push({ abbr, votes: null });
    }
  }

  return partyVotes;
}

// export async function saveMissingBallot(client: any, verification: number, body: Record<string, any>) {
//   await client.query(
//     INSERT INTO ballots_missing_data (verification_code, raw_data)
//     VALUES ($1, $2)
//     ON CONFLICT (verification_code) DO NOTHING
//   , [verification, JSON.stringify(body)]);
// }
