import  { Redis } from 'ioredis';
import dotenv from "dotenv";

dotenv.config();

// For Upstash Redis with ioredis, use this format:
const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Or if you have the full connection string:
// const redisClient = new Redis(process.env.REDIS_URL!, {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

redisClient.on('connect', () => console.log('Redis conectado con Upstash.'));
redisClient.on('error', (err: Error) => console.error(' Redis error:', err));

// Remove this line - ioredis connects automatically
// await redisClient.connect?.();

export default redisClient;