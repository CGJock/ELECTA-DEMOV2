import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { ensureDatabase } from './ensureDB.js';
import { initTables } from './initTables.js';
import depRouter from './routes/departments.js';
import  { insertDepartments }  from './seedDepartments.js'
import { insertParties } from './seedParties.js';
import { insertCandidates } from 'seedCandidates.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST']
}));

app.use('/api', depRouter);

(async () => {
  try {
    await ensureDatabase();
    await initTables();
    await insertCandidates();
    await insertDepartments();
    await insertParties();
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Servidor backend listo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el backend:', err);
  }
})();
