import { Pool } from 'pg';
import { Server } from 'socket.io';
import { setLatestVoteData } from './voteCache.js';

export async function listenToVotesChanges(pool: Pool, io: Server) {
  const client = await pool.connect();
  await client.query('LISTEN votes_channel');

  function toPercent(value: number, total: number): number {
    return total ? parseFloat(((value / total) * 100).toFixed(2)) : 0;
  }

  client.on('notification', (msg) => {
    try {
      const data = JSON.parse(msg.payload!);
      const enhancedData = {
        ...data,
        nullPercentage: toPercent(data.nullVotes, data.totalVotes),
        blankPercentage: toPercent(data.blankVotes, data.totalVotes),
        validPercentage: toPercent(data.validVotes, data.totalVotes),
      };
      setLatestVoteData(enhancedData);
      console.log(`payload`,msg)
      io.emit('full-vote-data', enhancedData);
    } catch (e) {
      console.error('Error processing NOTIFY payload:', e);
    }
  })
  };