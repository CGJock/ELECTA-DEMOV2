import { Pool } from 'pg';
import { getLatestElectionRoundId } from '@utils/getLastRound.js';
import redisClient from '@db/redis.js';

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
}

export interface GlobalSummary {
  totalVotes: number;
  blankVotes: number;
  nullVotes: number;
  partyBreakdown: PartySummary[];
}

export async function getTotalSummary(db: Pool): Promise<GlobalSummary> {

  const cached = await redisClient.get('total:summary');
  if (cached) {
    return JSON.parse(cached) as GlobalSummary;
  }

  const roundId = await getLatestElectionRoundId();
  if (!roundId) throw new Error('No election round found.');

  // Sumar votos por partido en la ronda actual
  const resultVotes = await db.query(
    `
    SELECT 
    COALESCE(SUM(valid_votes), 0) AS valid_votes,
    COALESCE(SUM(blank_votes), 0) AS blank_votes,
    COALESCE(SUM(null_votes), 0) AS null_votes,
    COALESCE(SUM(valid_votes + blank_votes + null_votes), 0) AS "totalVotes"
    FROM votes
    WHERE election_round_id = $1;
    `,
    [roundId]
  );
  const vote_data = resultVotes.rows[0]

 
  const totalVotes = vote_data.totalVotes
  const blankVotes = vote_data.blank_votes
  const nullVotes = vote_data.null_votes

  // Votos por partido
  const resultBreakdown = await db.query(
    `
    SELECT p.name, p.abbr, COALESCE(SUM(dv.votes), 0) as count
      FROM political_parties p
    LEFT JOIN department_votes dv
      ON p.id = dv.party_id AND dv.election_round_id = $1
    GROUP BY p.id
    ORDER BY count DESC
    `,
    [roundId]
  );

  const summary: GlobalSummary = {
  totalVotes: Number(vote_data.totalVotes),
  blankVotes: Number(vote_data.blank_votes),
  nullVotes: Number(vote_data.null_votes),
  partyBreakdown: resultBreakdown.rows.map((party) => ({
    name: party.name,
    abbr: party.abbr,
    count: Number(party.count),
    percentage: totalVotes ? Number(((Number(party.count) / totalVotes) * 100).toFixed(2)) : 0,
  }))
};

  await redisClient.set('total:summary', JSON.stringify(summary), 'EX', 600);
  return summary
  };