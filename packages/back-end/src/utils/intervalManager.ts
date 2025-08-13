// src/socket/intervalManager.ts

import { Server } from 'socket.io';
import { Pool } from 'pg';
import { sendGlobalSummary } from '@socket/global.js';
import { sendLocationSummaries } from '@socket/location.js';
import redisClient from '@db/redis.js';

let appInterval: NodeJS.Timeout | null = null;
let noClientTimer: NodeJS.Timeout | null = null;

export const startSummaryIntervals = (io: Server, db: Pool) => {

  if (appInterval) return; // If active
  
  
  const TEN_MINUTES = 10 * 60 * 1000;
  const ONE_MINUTE = 60 * 1000;

  // Ejecutar inmediatamente al iniciar
  sendGlobalSummary(io, db);
  sendLocationSummaries(io, db);

  // initialize intervals
  appInterval = setInterval(() => {
    const connectedClients = io.sockets.sockets.size;

    if (connectedClients === 0) {
      // Si no hay clientes y no hay temporizador activo, iniciamos cuenta regresiva
      if (!noClientTimer) {
        console.log('No clients connected. Waiting 1 minute before stopping intervals...');
        noClientTimer = setTimeout(() => {
          console.log('No clients for 1 minute, stopping intervals.');
          stopSummaryIntervals();
        }, ONE_MINUTE);
      }
      return; // No ejecutar envíos si no hay clientes
    }

    // Si hay clientes y había temporizador de cierre, lo cancelamos
    if (noClientTimer) {
      clearTimeout(noClientTimer);
      noClientTimer = null;
      console.log('Clients reconnected. Cancelled stop timer.');
    }

    sendGlobalSummary(io, db);
    sendLocationSummaries(io, db);
  }, TEN_MINUTES);

  console.log('Summary interval started every 10 minutes.');
};

export const stopSummaryIntervals = async () => {
  if (appInterval) {
    clearInterval(appInterval);
    appInterval = null;
    console.log('Summary interval stopped.');
  }

  if (noClientTimer) {
    clearTimeout(noClientTimer);
    noClientTimer = null;
  }

  try {
    await redisClient.quit();
    console.log('Redis client closed.');
  } catch (err) {
    console.error('Error closing Redis client:', err);
  }
};