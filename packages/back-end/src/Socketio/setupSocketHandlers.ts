import { Server } from 'socket.io';
import { Pool } from 'pg';
import { sendGlobalSummary } from './global.js';
import { getVotesSummary } from '@fetchers/votesDataFetcher.js';
import { getLocationSummary } from '@fetchers/locationBreakdownSummary.js';
import { getTotalSummary } from '@fetchers/breakdownSummary.js'; 
import { startSummaryIntervals, stopSummaryIntervals } from '@utils/intervalManager.js';
import redisClient from '@db/redis.js';

let noClientTimer: NodeJS.Timeout | null = null;

export function setupSocketHandlers(io: Server, db: Pool) {
io.on('connection', async(socket) => {
  console.log(`Socketio client conected: ${socket.id}`);

  // Si había timer para detener intervalos, cancelar porque llegó un cliente
    if (noClientTimer) {
      clearTimeout(noClientTimer);
      noClientTimer = null;
      console.log('Clients reconnected — canceled stop timer.');
    }

  // Arranca intervalos si no están activos
    startSummaryIntervals(io, db);
    
   // get the latest data for the global counter component
  try {
      const raw = await redisClient.get('latest:vote:data');
      if (raw) {
        const data = JSON.parse(raw);
        console.log('getting latestvotedata from redis', JSON.stringify(data))
       socket.emit('full-vote-data', data);
      } else {
        const fallbackdata = await getVotesSummary(db)//votes summary is the function to get the plain without party information

        await redisClient.set('latest:vote:data', JSON.stringify(fallbackdata), 'EX', 600);
        console.log(' getting fallback from db',fallbackdata)
        socket.emit('full-vote-data',fallbackdata)
      }
    } catch (error) {
      console.error('Error leyendo de Redis al conectar cliente:', error);
    }

    


    //checks last data for parties to initialize the component 
    try{
    const lastSummary = await getTotalSummary(db);
      if (lastSummary) {
        console.log('dataincial de las parties',lastSummary)
        socket.emit('initial-vote-summary',lastSummary);
      }
    } catch (error) {
      console.error('error getting last summary:', error);
    }

    //Global summary
   socket.on('get-total-breakdown', async () => {
    await sendGlobalSummary(io, db);
  });


    // Suscripción a un locationId específico
    socket.on('subscribe-to-location', async (locationCode: string) => {
      const room = `location-${locationCode}`;
        if (socket.rooms.has(room)) {
          console.log(`Socket ${socket.id} already subscribed to ${room}`);
          return; // no hacer nada
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

    // disconnect users
    socket.on('disconnect', () => {
      console.log(`Disconnected Client: ${socket.id}`);

      if (io.sockets.sockets.size === 0) {
        // Si no hay clientes conectados, espera 1 minuto antes de parar intervalos
        console.log('No clients connected, starting 1 minute timer to stop intervals...');
        noClientTimer = setTimeout(() => {
          stopSummaryIntervals();
          console.log('No clients for 1 minute, stopped summary intervals.');
        }, 60 * 1000);
      }
    });
  });
}