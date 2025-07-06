// src/socket/globalBroadcaster.ts
import { Server } from 'socket.io';
import { Pool } from 'pg';
import { getTotalSummary } from '../datafetchers/breakdownSummary.js'; 
import { getLocationSummary } from '../datafetchers/locationBreakdownSummary.js'; 

const getAllLocationIds = async (db: Pool): Promise<number[]> => {
  const result = await db.query('SELECT id FROM departments'); // or your table name
  return result.rows.map(row => row.id);
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
    const locationsIds = await getAllLocationIds(db);

    for (const id of locationsIds) {
      try {
        const data = await getLocationSummary(db, id);
        io.to(`location-${id}`).emit('location-breakdown-summary', data);
      } catch {
        io.to(`location-${id}`).emit('location-breakdown-summary', {
          error: 'Failed to fetch location summary'
        });
      }
    }
  };

  setInterval(sendGlobalSummary, 10000);
  setInterval(sendLocationSummaries, 10000);
}