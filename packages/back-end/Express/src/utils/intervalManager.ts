// src/socket/intervalManager.ts

import { Server } from 'socket.io';
import { Pool } from 'pg';
import { sendGlobalSummary } from '@socket/global.js';
import { sendLocationSummaries } from '@socket/location.js';
import redisClient from '@db/redis.js';

let appInterval: NodeJS.Timeout | null = null;

export const startSummaryIntervals = (io: Server, db: Pool) => {
  const TEN_MINUTES = 10 * 60 * 1000;

  // Ejecutar inmediatamente al iniciar
  sendGlobalSummary(io, db);
  sendLocationSummaries(io, db);

  // Iniciar intervalo conjunto
  appInterval = setInterval(() => {
    sendGlobalSummary(io, db);
    sendLocationSummaries(io, db);
  }, TEN_MINUTES);

  console.log('Summary interval started every 10 minutes.');
};

export const stopSummaryIntervals = async () => {
  if (appInterval) {
    clearInterval(appInterval);
    console.log('Summary interval stopped.');
    appInterval = null;
  }

  try {
    await redisClient.quit();
    console.log('Redis client closed.');
  } catch (err) {
    console.error('Error closing Redis client:', err);
  }
};
