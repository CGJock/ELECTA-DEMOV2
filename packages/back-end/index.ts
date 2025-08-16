

//logs only in dev, change to see the logs in prod
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '@db/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { useHelmet } from './src/middlewares/security.js';
import cookieParser from 'cookie-parser';

import  redisClient from '@db/redis.js'

//endpoint routes
import depRouter from '@routes/departments.js';
import newVoteRouter from '@routes/newUpdate.js'
import getmailsRouter from '@routes/getMails.js';
import postmailsRouter from '@routes/postEmail.js';
import getBallotsRouter from '@routes/getBallots.js';
import getIdsBallots from '@routes/getIdBallot.js'


// Sistema de Elecciones (Developer)
import getElectionsTypeRouter from '@routes/getElectionType.js'
import getCountriesRouter from '@routes/getCountries.js'
import postElection from '@routes/createElection.js'
import getActiveElectionInfo from '@routes/getActiveElectionFull.js'
import postActiveRoundandElection from '@routes/setActiveElection.js'
import getAllElectionRounds from '@routes/getAllElectionRounds.js'
import getActiveElecRouter from '@routes/getActiveElection.js'

// Sistema de Autenticación y Admin (Tus cambios)
import authRouter from '@routes/auth.js';
import whitelistRouter from '@routes/whitelist.js';
import siteStatusRouter from '@routes/siteStatus.js';
import adminManagementRouter from '@routes/adminManagement.js';
import componentVisibilityRouter from '@routes/componentVisibility.js';

// Utilidades y Configuración
import { runMigrations } from '@db/migrate.js';
import { listenToVotesChanges } from '@listeners/listenVotes.js';
import { setupSocketHandlers } from '@socket/setupSocketHandlers.js'
import { stopSummaryIntervals } from '@utils/intervalManager.js';
import { createAdapter } from '@socket.io/redis-streams-adapter';


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
  
  app.use(cookieParser());
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(cors({
    origin: [client_url,'http://localhost:3001','http://localhost:3000'],
    credentials: true,
  }));
  app.use(useHelmet);

  // Routes
  app.use('/api/departments', depRouter);
  app.use('/api/votes',newVoteRouter)
  // Connect Redis using ioredis
  try {
    // Verificar que Redis esté disponible
    await redisClient.ping();
    console.log('Redis Conexión establecida correctamente');
  } catch (error) {
    console.warn('redis not conected, :', (error as Error).message);
  }
  app.use('/api/get-emails', getmailsRouter);
  app.use('/api/post-emails', postmailsRouter);
  app.use('/api/get-ballot_id', getIdsBallots);
  app.use('/api/get-ballots',getBallotsRouter);
  
  // Sistema de Autenticación y Admin (Tus cambios)
  app.use('/api/auth', authRouter);
  app.use('/api/whitelist', whitelistRouter);
  app.use('/api/site-status', siteStatusRouter);
  app.use('/api/admin-management', adminManagementRouter);
  app.use('/api/component-visibility', componentVisibilityRouter);

  // Sistema de Elecciones (Developer)
  app.use('/api/get-election-types', getElectionsTypeRouter);
  app.use('/api/post-election', postElection);
  app.use('/api/get-countries',getCountriesRouter);
  app.use('/api/get_full-active_election',getActiveElectionInfo);
  app.use('/api/get-all-election-rounds',getAllElectionRounds);
  app.use('/api/post-active-election',postActiveRoundandElection)
  app.use('/api/get-active_election',getActiveElecRouter);

  // Setup Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: [client_url,'http://localhost:3001','http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });


  // Use the redis-streams-adapter
  io.adapter(createAdapter(redisClient));

  // Custom handlers
  setupSocketHandlers(io,pool);
  listenToVotesChanges(pool,io);

  setInterval(() => {
  console.log('Clientes conectados actualmente:', io.sockets.sockets.size);
}, 6000 * 2);

  //stops intervals and close all conections
const ShutdownServer = async () => {
  console.log('Cerrando servidor...');

  stopSummaryIntervals(); // stops intervals

  try {
    await redisClient.quit(); // closes redis connection
    console.log('✅ [Redis] Conexión cerrada correctamente');
  } catch (error) {
    console.warn('⚠️ [Redis] Error al cerrar conexión Redis:', (error as Error).message);
  }
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
    console.log(`🌐 [Routes] Endpoints disponibles:`);
    console.log(`   - GET  http://localhost:${PORT}/api/site-status`);
    console.log(`   - PUT  http://localhost:${PORT}/api/site-status`);
    console.log(`   - GET  http://localhost:${PORT}/api/whitelist`);
    console.log(`   - POST http://localhost:${PORT}/api/whitelist`);
  });

  httpServer.on('error', (err) => {
    console.error('Error in Http server:', err);
  });
}

main().catch((err) => {
  console.error('Error starting app:', err);
  process.exit(1);
});