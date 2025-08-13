import { Pool } from 'pg';
import { Server } from 'socket.io';
import redisClient from '@db/redis.js';
import { toPercenData } from '@utils/toPercentage.js';

export async function listenToVotesChanges(pool: Pool, io: Server) {
  const client = await pool.connect();
  await client.query('LISTEN votes_channel');
  console.log(' Listening to channel: votes_channel');

   let debounceTimeout: NodeJS.Timeout | null = null;
   let latestData: any = null;


  client.on('notification', async (msg) => {
    console.log(' Notificación recibida desde PostgreSQL');

    try {
      const data = JSON.parse(msg.payload!);
      console.log(' Payload parseado:', data);

      const enhancedData = toPercenData(data);

      latestData = enhancedData;

      console.log('datos desde listen votes:', enhancedData);

      // Guardar en Redis
      console.log(' Intentando guardar en Redis...');
      const redisResult = await redisClient.set(
        'latest:vote:data',
        JSON.stringify(latestData),
        'EX',
        600 // Elimina después de 10 minutos
        // 'NX' // Quita 'NX' si quieres sobreescribir siempre
      );

      if (debounceTimeout) clearTimeout(debounceTimeout);

      // Espera 500ms sin nuevas notificaciones para emitir al socket
      debounceTimeout = setTimeout(() => {
        io.emit('full-vote-data', latestData);
        console.log('Emitiendo evento "full-vote-data" por socket con debounce', latestData);
        debounceTimeout = null;
      }, 500);
    } catch (e) {
      console.error(' Error procesando NOTIFY payload:', e);
    }
  });
}

