import { Pool } from 'pg';
import { Server } from 'socket.io';
import redisClient from '@db/redis.js';
import { toPercenData } from '@utils/toPercentage.js';

export async function listenToVotesChanges(pool: Pool, io: Server) {
  const client = await pool.connect();
  await client.query('LISTEN votes_channel');
  console.log(' Escuchando canal: votes_channel');

  function toPercent(value: number, total: number): number {
    return total ? parseFloat(((value / total) * 100).toFixed(2)) : 0;
  }

  client.on('notification', async (msg) => {
    console.log(' Notificación recibida desde PostgreSQL');

    try {
      const data = JSON.parse(msg.payload!);
      console.log(' Payload parseado:', data);

      const enhancedData = toPercenData(data)

      console.log('🔧Datos enriquecidos:', enhancedData);

      // Guardar en Redis
      console.log(' Intentando guardar en Redis...');
      const redisResult = await redisClient.set(
        'latest:vote:data',
        JSON.stringify(enhancedData),
        'EX',
        600 // Elimina después de 10 minutos
        // 'NX' // Quita 'NX' si quieres sobreescribir siempre
      );
      console.log(' Resultado de Redis SET:', redisResult);

      // Emitir por socket
      console.log('Enviando evento "full-vote-data" por socket...');
      io.emit('full-vote-data', enhancedData);
    } catch (e) {
      console.error(' Error procesando NOTIFY payload:', e);
    }
  });
}

