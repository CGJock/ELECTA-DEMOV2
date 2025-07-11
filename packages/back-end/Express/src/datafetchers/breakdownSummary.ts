import { Pool } from 'pg';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';

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
  const roundId = await getLatestElectionRoundId();
  if (!roundId) throw new Error('No election round found.');

  // Sumar votos por partido en la ronda actual
  const resultVotes = await db.query(
    `SELECT COALESCE(SUM(votes), 0) as count
     FROM departments_votes
     WHERE election_round_id = $1`,
    [roundId]
  );
  const totalVotes = Number(resultVotes.rows[0].count);

  // Votos nulos y en blanco (asumiendo una fila por ronda en la tabla `votes`)
  const resultSpecialVotes = await db.query(
    `SELECT COALESCE(blank_votes, 0) AS blank, COALESCE(null_votes, 0) AS null
     FROM votes
     WHERE election_round_id = $1
     LIMIT 1`,
    [roundId]
  );
  const blankVotes = Number(resultSpecialVotes.rows[0]?.blank || 0);
  const nullVotes = Number(resultSpecialVotes.rows[0]?.null || 0);

  // Votos por partido
  const resultBreakdown = await db.query(
    `
    SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
    FROM political_parties p
    LEFT JOIN departments_votes dv
      ON p.id = dv.party_id AND dv.election_round_id = $1
    GROUP BY p.id
    ORDER BY count DESC
    `,
    [roundId]
  );

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