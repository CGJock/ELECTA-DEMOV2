import { Pool } from 'pg';
import { Server } from 'socket.io';

export async function listenToVotesChanges(pool: Pool, io: Server) {
  const client = await pool.connect();
  await client.query('LISTEN votes_channel');

function toPercent(value: number, total: number): number {
  return total ? parseFloat(((value / total) * 100).toFixed(2)) : 0;
}

 client.on('notification', (msg) => {
  try {
    const data = JSON.parse(msg.payload!); 
    io.emit('full-vote-data', {
      ...data,//original data 
      nullPercentage: toPercent(data.nullVotes, data.totalVotes),
      blankPercentage: toPercent(data.blankVotes, data.totalVotes),  //parese data to float %
      validPercentage: toPercent(data.validVotes, data.totalVotes),
    });
    console.log(`Payload recibido de ${msg.channel}: ${msg.payload}`);
  } catch (e) {
    console.error('Error al procesar payload de NOTIFY:', e);
  }
  io.emit('last-update'), (msg), msg

});


  console.log('Listening NOTIFY in  votes_channel');
}
