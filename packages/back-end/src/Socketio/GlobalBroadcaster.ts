// src/socket/globalBroadcaster.ts
// import { Server } from 'socket.io';
// import { Pool } from 'pg';
// import { getTotalSummary } from '@fetchers/breakdownSummary.js'; 
// import { getLocationSummary } from '@fetchers/locationBreakdownSummary.js'; 
// import redisClient from '@db/redis.js';

// const getAllLocationIds = async (db: Pool): Promise<string[]> => {
//   const result = await db.query('SELECT code FROM departments'); // or your table name
//   return result.rows.map(row => row.code);
// };


// export function setupGlobalBroadcaster(io: Server, db: Pool) {
 
//   // Emitir resumen global a todos los clientes
//    const sendGlobalSummary = async () => {
//     try {
//       const raw = await redisClient.get('total:summary');
//       if (raw) {
//         console.log('redis_data', JSON.parse(raw));
//         io.emit('total-breakdown-summary', raw);
//       } else if(!raw) { 
//       const data = await getTotalSummary(db);
//       io.emit('total-breakdown-summary', data); 
//       }
//     } catch {
//       io.emit('total-breakdown-summary', { error: 'Failed to fetch total summary' });
//     }
//   };

//   // Emitir resumen por cada ubicación solo a quienes estén suscritos
//   const sendLocationSummaries = async () => {
//   const locationCodes = await getAllLocationIds(db);

//   for (const code of locationCodes) {
//     const redisKey = `location-${code}`;
//     let data;

//     try {
//       const cached = await redisClient.get(redisKey);

//       if (cached) {
//         console.log(`Found cached data for ${redisKey}`);
//         data = JSON.parse(cached);
//       } else {
//         console.log(`No cached data for ${redisKey}, fetching from DB`);
//         data = await getLocationSummary(db, code);

//         // Guardar en Redis con un TTL de 60 segundos, por ejemplo
//         await redisClient.set(redisKey, JSON.stringify(data), 'EX', 60);
//       }

//       io.to(redisKey).emit('location-breakdown-summary', data);
//     } catch (err) {
//       console.error(`Error processing ${redisKey}:`, err);
//       io.to(redisKey).emit('location-breakdown-summary', {
//         error: 'Failed to fetch location summary'
//       });
//     }
//   }
// };

//   setInterval(sendGlobalSummary, 60000 * 10);
//   setInterval(sendLocationSummaries, 60000 * 10);
// }