import { Pool } from 'pg';

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: string;
}

export interface LocationSummary {
  locationId: number;
  locationName: string;
  totalVotes: number;
  partyBreakdown: PartySummary[];
}

export async function getLocationSummary(db: Pool, locationId: number): Promise<LocationSummary> {
  // Obtener total de votos en la ubicación
  const totalVotesResult = await db.query(
    `SELECT COALESCE(SUM(votes), 0) as count FROM departments_votes WHERE department_id = $1`,
    [locationId]
  );
  const totalVotes = Number(totalVotesResult.rows[0].count);

  // Obtener votos por partido
  const votesPerPartyResult = await db.query(
    `
    SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
    FROM political_parties p
    LEFT JOIN departments_votes dv ON p.id = dv.party_id AND dv.department_id = $1
    GROUP BY p.id, p.name, p.abbr
    ORDER BY count DESC
    `,
    [locationId]
  );

  const partyBreakdown: PartySummary[] = votesPerPartyResult.rows.map(party => ({
    name: party.name,
    abbr: party.abbr,
    count: Number(party.count),
    percentage: totalVotes ? ((Number(party.count) / totalVotes) * 100).toFixed(2) : '0.00'
  }));

  // Obtener nombre del departamento
  const locationNameResult = await db.query(
    `SELECT name FROM departments WHERE id = $1`,
    [locationId]
  );
  const locationName = locationNameResult.rows[0]?.name || `ID ${locationId}`;

  return {
    locationId,
    locationName,
    totalVotes,
    partyBreakdown
  };
}
