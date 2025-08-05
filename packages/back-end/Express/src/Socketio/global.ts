import { Server } from 'socket.io';
import { Pool } from 'pg';
import { getTotalSummary } from '@fetchers/breakdownSummary.js'; 
import redisClient from '@db/redis.js';

export const sendGlobalSummary = async (io: Server, db: Pool) => {
  try {
    const raw = await redisClient.get('total:summary');
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log('redis_data', parsed);
      io.emit('total-breakdown-summary', parsed);
    } else {
      const data = await getTotalSummary(db);
      console.log('data politicalparites desde el db',data)
      io.emit('total-breakdown-summary', data);

      // saves the data in redis
      await redisClient.set('total:summary', JSON.stringify(data), 'EX', 600);
      console.log('redis data has been saved');
    }
  } catch (error) {
    console.error('Error in sendGlobalSummary:', error);
    io.emit('total-breakdown-summary', { error: 'Failed to fetch total summary' });
  }
};

