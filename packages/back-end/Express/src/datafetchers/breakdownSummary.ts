import { Pool } from 'pg';

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: string;
}

export interface GlobalSummary {
  totalVotes: number;
  blankVotes: number;
  nullVotes: number;
  partyBreakdown: PartySummary[];
}

export async function getTotalSummary(db: Pool): Promise<GlobalSummary> {
  // Sumar votos por partido
  const resultVotes = await db.query(`SELECT COALESCE(SUM(votes), 0) as count FROM departments_votes`);
  const totalVotes = Number(resultVotes.rows[0].count);

  // Obtener votos nulos y en blanco (asumiendo una sola fila en `votes`)
  const resultSpecialVotes = await db.query(`SELECT COALESCE(blank_votes, 0) AS blank, COALESCE(null_votes, 0) AS null FROM votes LIMIT 1`);
  const blankVotes = Number(resultSpecialVotes.rows[0]?.blank || 0);
  const nullVotes = Number(resultSpecialVotes.rows[0]?.null || 0);

  // Votos por partido
  const resultBreakdown = await db.query(`
    SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
    FROM political_parties p
    LEFT JOIN departments_votes dv ON p.id = dv.party_id
    GROUP BY p.id
    ORDER BY count DESC
  `);

  const partyBreakdown: PartySummary[] = resultBreakdown.rows.map((party) => ({
    name: party.name,
    abbr: party.abbr,
    count: Number(party.count),
    percentage: totalVotes ? ((Number(party.count) / totalVotes) * 100).toFixed(2) : '0.00',
  }));

  return {
    totalVotes,
    blankVotes,
    nullVotes,
    partyBreakdown,
  };
}
