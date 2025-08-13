import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '@db/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { useHelmet } from '@middlerare/security.js';

// import  redisClient from '@db/redis.js'


import depRouter from '@routes/departments.js';
import voteRouter from '@routes/updateVotes.js';
import newVoteRouter from '@routes/newUpdate.js'
import getmailsRouter from '@routes/getMails.js';
import postmailsRouter from '@routes/postEmail.js';
import authRouter from '@routes/auth.js';
import { runMigrations } from '@db/migrate.js';
// import { listenToVotesChanges } from '@listeners/listenVotes.js';
// import { setupSocketHandlers } from '@socket/setupSocketHandlers.js'
// // import { startSummaryIntervals, stopSummaryIntervals } from '@utils/intervalManager.js';
// import { createAdapter } from '@socket.io/redis-streams-adapter';
import { Pool } from 'pg';

dotenv.config();


async function main() {
  const client_url = process.env.CLIENT_URL || 'http://localhost:3001';
  const PORT = process.env.PORT || 5000;

  // Run DB migrations first
  console.log('Ejecutando migraciones...');
  await runMigrations();
  console.log('Migraciones completadas.');

  // Create Express app
  const app = express();
  const httpServer = createServer(app);

  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(cors({
    origin: [client_url,'http://localhost:3001','http://localhost:3000'],
    credentials: true,
  }));
  app.use(useHelmet);

  // Routes
  app.use('/api/departments', depRouter);
  // app.use('/api/votes', voteRouter);
  app.use('/api/votes',newVoteRouter)
  app.use('/api/get-emails', getmailsRouter);
  app.use('/api/post-emails', postmailsRouter)
  app.use('/api/auth', authRouter);

  // Connect Redis using ioredis
  // const redisClient = new Redis(redis_url, {
  //   maxRetriesPerRequest: null,
  //   enableReadyCheck: false,
  // });



  

  // Setup Socket.IO server
  const io = new Server(httpServer, {
    // adapter: createAdapter(redisClient),
    cors: {
      origin: [client_url,'http://localhost:3001','http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Use the redis-streams-adapter
  // io.adapter(createAdapter(redisClient));

  // Custom handlers
  // startSummaryIntervals(io,pool)//starts server intervals
  // setupSocketHandlers(io,pool);
  // listenToVotesChanges(pool,io);
  // setupGlobalBroadcaster(io,pool);

  //stops intervals and close all conections
const ShutdownServer = async () => {
  console.log('Cerrando servidor...');

  // stopSummaryIntervals(); // stops intervals

  // await redisClient.quit(); // closes redis conection
  await pool.end(); // closes Postgres conection

  httpServer.close(() => {
    console.log('Servidor cerrado correctamente.');
    process.exit(0);
  });
};


// listens to shutdown signals
process.on('SIGTERM', ShutdownServer);
process.on('SIGINT', ShutdownServer);

  // Start server
  
  console.log('Preparado para iniciar servidor...');
  httpServer.listen(PORT, () => {
    console.log(`✅ Backend Server running at http://localhost:${PORT}`);
  });

  httpServer.on('error', (err) => {
    console.error('Error in Http server:', err);
  });
}

main().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});