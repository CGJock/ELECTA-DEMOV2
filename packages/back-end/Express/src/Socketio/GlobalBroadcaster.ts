// src/socket/globalBroadcaster.ts
import { Server } from 'socket.io';
import { Pool } from 'pg';
import { getTotalSummary } from '@fetchers/breakdownSummary.js'; 
import { getLocationSummary } from '@fetchers/locationBreakdownSummary.js'; 

const getAllLocationIds = async (db: Pool): Promise<string[]> => {
  const result = await db.query('SELECT code FROM departments'); // or your table name
  return result.rows.map(row => row.code);
};


export function setupGlobalBroadcaster(io: Server, db: Pool) {
  // Emitir resumen global a todos los clientes
  const sendGlobalSummary = async () => {
    try {
      const data = await getTotalSummary(db);
      io.emit('total-breakdown-summary', data); // 🔊 broadcast global
    } catch {
      io.emit('total-breakdown-summary', { error: 'Failed to fetch total summary' });
    }
  };

  // Emitir resumen por cada ubicación solo a quienes estén suscritos
  const sendLocationSummaries = async () => {
    const locationCodes = await getAllLocationIds(db);

    for (const code of locationCodes) {
      try {
        const data = await getLocationSummary(db, code);
        io.to(`location-${code}`).emit('location-breakdown-summary', data);
      } catch {
        io.to(`location-${code}`).emit('location-breakdown-summary', {
          error: 'Failed to fetch location summary'
        });
      }
    }
  };

  setInterval(sendGlobalSummary, 10000);
  setInterval(sendLocationSummaries, 10000);
}