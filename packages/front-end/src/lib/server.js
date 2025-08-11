// // server.js
// import express from 'express';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import http from 'http';
// import { startVoteSeeder } from './startVoteSeeder.js';

// import { initDB } from './db.js';
// import { setupSocketHandlers } from './sockethandlers.js';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   }
// });

// const db = await initDB();
// startVoteSeeder(io,db)
// setupSocketHandlers(io, db);


// server.listen(4000, () => {
//   console.log('✅ Servidor en http://localhost:4000');
// });

// server.js
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { startVoteSeeder } from './startVoteSeeder.js';

import { initDB, getProposalsByCandidate } from './db.js';
import { setupSocketHandlers } from './sockethandlers.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Enable CORS for Express routes
app.use(cors());
app.use(express.json());

const db = await initDB();
console.log('db.all:', typeof db.all); 

// Ya no se hace await a initDB
startVoteSeeder(db, io);
setupSocketHandlers(io, db);

// Endpoint para obtener propuestas de un candidato
app.get('/api/candidate/:id/proposals', async (req, res) => {
  const candidateId = req.params.id;
  try {
    const proposals = await getProposalsByCandidate(db, candidateId);
    res.json({ proposals });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching proposals' });
  }
});

server.listen(4000, () => {
  console.log('✅ Servidor en http://localhost:4000');
});