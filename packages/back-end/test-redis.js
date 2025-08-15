import dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config();

console.log('🔍 Probando conexión a Redis...');
console.log('📝 REDIS_URL:', process.env.REDIS_URL);

const redisClient = new Redis(process.env.REDIS_URL || '', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

redisClient.on('connect', () => {
  console.log('✅ Redis conectado con Upstash.');
});

redisClient.on('ready', () => {
  console.log('✅ Redis listo para usar.');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

redisClient.on('close', () => {
  console.log('🔌 Conexión Redis cerrada.');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Reconectando a Redis...');
});

// Probar operaciones básicas
async function testRedis() {
  try {
    console.log('🧪 Probando operaciones básicas...');
    
    // Probar SET
    const setResult = await redisClient.set('test:key', 'test:value', 'EX', 60);
    console.log('✅ SET result:', setResult);
    
    // Probar GET
    const getResult = await redisClient.get('test:key');
    console.log('✅ GET result:', getResult);
    
    // Probar DELETE
    const delResult = await redisClient.del('test:key');
    console.log('✅ DELETE result:', delResult);
    
    console.log('🎉 ¡Redis funciona correctamente!');
    
    // Cerrar conexión
    await redisClient.quit();
    console.log('👋 Conexión cerrada.');
    
  } catch (error) {
    console.error('💥 Error probando Redis:', error);
  }
}

// Ejecutar prueba
testRedis();
