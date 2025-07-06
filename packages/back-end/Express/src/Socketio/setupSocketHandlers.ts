import { Server } from 'socket.io';
import { Pool } from 'pg';
import { getTotalSummary } from '../datafetchers/breakdownSummary.js'
import { getLocationSummary } from '../datafetchers/locationBreakdownSummary.js';


export function setupSocketHandlers(io: Server, db: Pool) {
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    let globalSummaryInterval: NodeJS.Timeout | null = null;
    let locationSummaryInterval: NodeJS.Timeout | null = null;

    // --- Global summary ---
    socket.on('get-total-breakdown', async () => {
      const sendGlobalSummary = async () => {
        try {
          const data = await getTotalSummary(db);
          socket.emit('total-breakdown-summary', data);
        } catch {
          socket.emit('total-breakdown-summary', { error: 'Failed to fetch total summary' });
        }
      };

      await sendGlobalSummary();

      if (!globalSummaryInterval) {
        globalSummaryInterval = setInterval(sendGlobalSummary, 10000); // cada 10s
      }
    });

        // Suscripción a un locationId específico
    socket.on('subscribe-to-location', (locationId: number) => {
        // Primero salir de cualquier room anterior de ubicación (opcional si solo una a la vez)
      for (const room of socket.rooms) {
        if (room.startsWith('location-')) {
          socket.leave(room);
        }
      }
        // Unirse a la nueva ubicación
      socket.join(`location-${locationId}`);
      console.log(`Cliente ${socket.id} se unió a location-${locationId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  

    // --- Cleanup on disconnect ---
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
      if (globalSummaryInterval) clearInterval(globalSummaryInterval);
      if (locationSummaryInterval) clearInterval(locationSummaryInterval);
    });
  });
}
