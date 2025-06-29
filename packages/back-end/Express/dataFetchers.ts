import { Pool } from 'pg';

export interface VotesBreakdown {
  totalVotes: number;
  nullVotes: number;
  nullPercentage: number;
  blankVotes: number;
  blankPercentage: number;
  validVotes: number;
  validPercentage: number;
}

export async function getVotesBreakdown(pool: Pool): Promise<VotesBreakdown> {
  const result = await pool.query(`
    SELECT
      SUM(valid_votes) AS validVotes,
      SUM(blank_votes) AS blankVotes,
      SUM(null_votes) AS nullVotes,
      SUM(valid_votes + blank_votes + null_votes) AS totalVotes
    FROM votes;
  `);

  const row = result.rows[0];

  const totalVotes = Number(row.totalvotes) || 0;
  const nullVotes = Number(row.nullvotes) || 0;
  const blankVotes = Number(row.blankvotes) || 0;
  const validVotes = Number(row.validvotes) || 0;

  const toPercent = (value: number, total: number): number =>
    total ? parseFloat(((value / total) * 100).toFixed(2)) : 0;

  return {
    totalVotes,
    nullVotes,
    nullPercentage: toPercent(nullVotes, totalVotes),

    blankVotes,
    blankPercentage: toPercent(blankVotes, totalVotes),

    validVotes,
    validPercentage: toPercent(validVotes, totalVotes)
  };
}

