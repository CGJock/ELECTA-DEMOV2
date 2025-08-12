// utils/missingDataCheck.ts
import { PartyData } from "../types/PartyData.js";

export function ballotHasMissingData(
  nullVotes: number,
  blankVotes: number,
  validVotes: number,
  partyVotes: PartyData[],
  requiredFields: Record<string, any>
): boolean {
  // 1. Missing or invalid totals
  if ([nullVotes, blankVotes, validVotes].some(v => v === -1 || v === null || Number.isNaN(v))) {
    return true;
  }

  // 2. Any party vote -1
  if (partyVotes.some(p => p.votes === -1 || p.votes=== null)) {
    return true;
  }

  // 3. Required metadata missing or empty
  const requiredKeys = ["verification", "department", "project_id", "project_name", "date_start_time", "date_time_complete", "image_url"];
  for (const key of requiredKeys) {
    const val = requiredFields[key];
    if (!val || (typeof val === "string" && val.trim() === "")) {
      return true;
    }
  }

  return false;
}
