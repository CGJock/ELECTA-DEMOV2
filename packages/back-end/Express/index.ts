import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '@db/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { useHelmet } from '@middlerare/security.js';


import depRouter from '@routes/departments.js';
import voteRouter from '@routes/updateVotes.js';
import { runMigrations } from '@db/migrate.js';
import { listenToVotesChanges } from '@listeners/listenVotes.js';
import { setupSocketHandlers } from '@socket/setupSocketHandlers.js'
import { setupGlobalBroadcaster } from '@socket/GlobalBroadcaster.js'

dotenv.config();


const app = express();
app.set('trust proxy', 1)
const client_url = process.env.CLIENT_URL || 'http://localhost:3000';


app.use(express.json());
app.use(cors({
  origin: [client_url, 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));




// enabling the Helmet middleware
app.use(useHelmet); //protects http headers

//Routes
app.use('/api/departments', depRouter);
app.use('/api/votes', voteRouter);


// inizialize node server
const httpServer = createServer(app);
//initialize io server in node http

const io = new Server(httpServer, {
  cors: {
    origin: [client_url, 'http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

(async () => {
  try {
    await runMigrations();

    const PORT = process.env.PORT || 4000;
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
