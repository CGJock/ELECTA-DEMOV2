import { Server } from 'socket.io';
import { Pool } from 'pg';
import { sendGlobalSummary } from './global.js';
import { getVotesSummary } from '@fetchers/votesDataFetcher.js';
import { getLocationSummary } from '@fetchers/locationBreakdownSummary.js';
import { getTotalSummary } from '@fetchers/breakdownSummary.js'; 
import { startSummaryIntervals, stopSummaryIntervals } from '@utils/intervalManager.js';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';
import redisClient from '@db/redis.js';

let noClientTimer: NodeJS.Timeout | null = null;

export function setupSocketHandlers(io: Server, db: Pool) {
  io.on('connection', async (socket) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Socket.io client connected: ${socket.id}`);
    }

    // Si había timer de apagar, lo cancelamos
    if (noClientTimer) {
      clearTimeout(noClientTimer);
      noClientTimer = null;
      if (process.env.NODE_ENV !== 'production') {
        console.log('Clients reconnected — canceled stop timer.');
      }
    }

    // Arranca intervalos si no están activos
    startSummaryIntervals(io, db);

    /**
     * --- Emitir datos iniciales al conectar ---
     */
    try {
      const roundId = await getActiveElectionRoundId();
      const redisKey = `latest:vote:data:${roundId}`;
      const raw = await redisClient.get(redisKey);

      if (raw) {
        const data = JSON.parse(raw);
        if (process.env.NODE_ENV !== 'production') {
          console.log('getting latest vote data from redis', JSON.stringify(data));
        }
        socket.emit('full-vote-data', data);
      } else {
        const fallbackData = await getVotesSummary(db);
        await redisClient.set(redisKey, JSON.stringify(fallbackData), 'EX', 600);

        if (process.env.NODE_ENV !== 'production') {
          console.log('getting fallback from db', fallbackData);
        }
        socket.emit('full-vote-data', fallbackData);
      }
    } catch (error) {
      console.error('Error leyendo de Redis al conectar cliente:', error);
    }

    try {
      const lastSummary = await getTotalSummary(db);
      if (lastSummary) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Datos iniciales de las parties', lastSummary);
        }
        socket.emit('initial-vote-summary', lastSummary);
      }
    } catch (error) {
      console.error('Error getting last summary:', error);
    }

    /**
     * --- Eventos ---
     */
    socket.on('get-total-breakdown', async () => {
      await sendGlobalSummary(io, db);
    });

    socket.on('subscribe-to-location', async (locationCode: string) => {
      const room = `location-${locationCode}`;
      if (socket.rooms.has(room)) {
        console.log(`Socket ${socket.id} already subscribed to ${room}`);
        return;
      }

      try {
        const redisKey = `location-${locationCode}`;
        const cached = await redisClient.get(redisKey);

        if (cached) {
          console.log(`Sending cached data for ${room} on subscribe`);
          socket.emit('location-breakdown-summary', JSON.parse(cached));
        } else {
          const data = await getLocationSummary(db, locationCode);
          socket.emit('location-breakdown-summary', data);

          // Guardar en Redis con TTL
          await redisClient.set(redisKey, JSON.stringify(data), 'EX', 60);
        }
      } catch (err) {
        console.error(`Error sending data for ${room}:`, err);
        socket.emit('location-breakdown-summary', {
          error: 'Failed to fetch location summary',
        });
      }
    });

    /**
     * --- Desconexión ---
     */
    socket.on('disconnect', () => {
      console.log(`Disconnected Client: ${socket.id}`);

      if (io.sockets.sockets.size === 0) {
        console.log('No clients connected, starting 1 minute timer to stop intervals...');
        noClientTimer = setTimeout(() => {
          stopSummaryIntervals(); // Solo apaga intervalos
          console.log('No clients for 1 minute, stopped summary intervals.');
        }, 60 * 1000);
      }
    });
  });
}