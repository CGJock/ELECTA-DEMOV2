import { Server } from 'socket.io';
import { Pool } from 'pg';
import { getVotesSummary } from '@fetchers/votesDataFetcher.js';
import { getLocationSummary } from '@fetchers/locationBreakdownSummary.js';
import { getLatestVoteData, setLatestVoteData } from '@listeners/voteCache.js';

export function setupSocketHandlers(io: Server, db: Pool) {
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  let globalSummaryInterval: NodeJS.Timeout | null = null;
  let locationSummaryInterval: NodeJS.Timeout | null = null;

  const handleInitialData = async () => {
    let cached = getLatestVoteData();

    if (!cached) {
      try {
        cached = await getVotesSummary(db); // obtener dato directo en BD
        setLatestVoteData(cached);          // guardar en caché
      } catch (e) {
        console.error('Error al obtener datos iniciales:', e);
      }
    }

    if (cached) {
      socket.emit('full-vote-data', cached);
    }
  };

  // Llamar a la función async separada
  handleInitialData();

    // --- Global summary ---
    socket.on('get-total-breakdown', async () => {
      const sendGlobalSummary = async () => {
        try {
          const data = await getVotesSummary(db);
          socket.emit('total-breakdown-summary', data);
        } catch {
          socket.emit('total-breakdown-summary', { error: 'Failed to fetch total summary' });
        }
      };

      await sendGlobalSummary();

      if (!globalSummaryInterval) {
        globalSummaryInterval = setInterval(sendGlobalSummary, 30000); // cada 10s
      }
    });

    // Suscripción a un locationId específico
    socket.on('subscribe-to-location', (locationCode: string) => {
      for (const room of socket.rooms) {
        if (room.startsWith('location-')) {
          socket.leave(room);
        }
      }
      socket.join(`location-${locationCode}`);
      console.log(`Client ${socket.id} se unió a location-${locationCode}`);
    });

    // --- Cleanup on disconnect ---
    socket.on('disconnect', () => {
      console.log(`Disconnected Client: ${socket.id}`);
      if (globalSummaryInterval) clearInterval(globalSummaryInterval);
      if (locationSummaryInterval) clearInterval(locationSummaryInterval);
    });
  });
}
