import { createClient } from 'redis';

// Usa tu URL de Redis (de Upstash) aquí:
const redisUrl = 'rediss://default:AepnAAIjcDE3OGE3NzliMWNjM2M0ZTcxYTY5N2I5OGM2OTE5YTU2NHAxMA@awaited-swift-60007.upstash.io:6379'; // reemplaza con el tuyo

const client = createClient({
  url: redisUrl,
  socket: {
    tls: true,         // importante para rediss://
    reconnectStrategy: false
  }
});

client.on('error', (err) => {
  console.error('❌ Error al conectar a Redis:', err.message);
  process.exit(1);
});

(async () => {
  try {
    await client.connect();
    const pong = await client.ping();
    console.log('✅ Redis respondió:', pong); // Debería imprimir "PONG"
    await client.quit();
  } catch (error) {
    console.error('❌ Error durante prueba:', error);
  }
})();
