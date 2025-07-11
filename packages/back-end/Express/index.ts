import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '@db/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

import depRouter from '@routes/departments.js';
import voteRouter from '@routes/updateVotes.js';
import { runMigrations } from '@db/migrate.js';
import { listenToVotesChanges } from '@listeners/listenVotes.js';
import { setupSocketHandlers } from '@socket/setupSocketHandlers.js'
import { setupGlobalBroadcaster } from '@socket/GlobalBroadcaster.js'

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use('/api/departments', depRouter);
app.use('/api/votes', voteRouter);


// Inicializar servidor HTTP + socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST']
  }
});

(async () => {
  try {
    await runMigrations();

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      
      setupSocketHandlers(io, pool)
      setupGlobalBroadcaster(io, pool); 
      listenToVotesChanges(pool, io);//listen to notify in postresql
      
      console.log(`Servidor backend listo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el backend:', err);
  }
})();
