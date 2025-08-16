import { Pool } from 'pg';
import { Server } from 'socket.io';
import redisClient from '@db/redis.js';
import { toPercenData } from '@utils/toPercentage.js';
import { getActiveElectionRoundId } from '@utils/getActiveElectionAndRound.js';

export async function listenToVotesChanges(pool: Pool, io: Server) {
  const client = await pool.connect();
  await client.query('LISTEN votes_channel');
  
    if (process.env.NODE_ENV !== 'production') {
            console.log(' Listening to channel: votes_channel');
        }

   let debounceTimeout: NodeJS.Timeout | null = null;
   let latestData: any = null;


  client.on('notification', async (msg) => {
    console.log(' Notificación recibida desde PostgreSQL');

    try {
      const data = JSON.parse(msg.payload!);
      console.log(' Payload parseado:', data);

      // Obtener siempre la ronda activa al momento de la notificación
      const roundId = await getActiveElectionRoundId();
      if (!roundId) {
         if (process.env.NODE_ENV !== 'production') {
            console.warn('No hay ronda activa, no se guardarán datos en Redis ni se emitirá por socket.');
        }
        
        return;
      }

      const redisKey = `latest:vote:data:${roundId}`;
      const enhancedData = toPercenData(data);
      latestData = { election_round_id: roundId, ...enhancedData };

      console.log('Datos desde listen votes:', latestData);

      // Guardar en Redis con key que incluye roundId
      await redisClient.set(redisKey, JSON.stringify(latestData), 'EX', 600);

      if (debounceTimeout) clearTimeout(debounceTimeout);

      // Espera 500ms sin nuevas notificaciones para emitir al socket
      debounceTimeout = setTimeout(() => {
        io.emit('full-vote-data', latestData);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Emitiendo evento "full-vote-data" por socket con debounce', latestData);
        }
        
        debounceTimeout = null;
      }, 500);
    } catch (e) {
      console.error(' Error procesando NOTIFY payload:', e);
    }
  });
}

