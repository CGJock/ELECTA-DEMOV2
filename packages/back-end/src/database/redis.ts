import  { Redis } from 'ioredis';
import dotenv from "dotenv";

dotenv.config();

// Verificar que REDIS_URL esté configurada
if (!process.env.REDIS_URL) {
  console.error('❌ REDIS_URL no está configurada en las variables de entorno');
  console.error('💡 Crea un archivo .env en packages/back-end/Express/ con tu REDIS_URL de Upstash');
  console.error('📝 Ejemplo: REDIS_URL=rediss://default:password@host.upstash.io:6379');
}

// For Upstash Redis with ioredis, use this format:
const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
});

redisClient.on('connect', () => console.log('✅ Redis conectado con Upstash.'));
redisClient.on('error', (err: Error) => {
  console.error('❌ Redis error:', err.message);
  if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
    console.error('💡 Verifica que tu REDIS_URL sea correcta y que la base de datos esté activa en Upstash');
  }
});

export default redisClient;