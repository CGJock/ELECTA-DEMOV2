// src/socket/intervalManager.ts

import { Server } from 'socket.io';
import { Pool } from 'pg';
import { sendGlobalSummary } from '@socket/global.js';
import { sendLocationSummaries } from '@socket/location.js';

let appInterval: NodeJS.Timeout | null = null;

const TEN_MINUTES = 10 * 60 * 1000;

/**
 * Inicia los intervalos de envío de resúmenes.
 */
export const startSummaryIntervals = (io: Server, db: Pool) => {
  if (appInterval) return; // Ya está activo

  // Ejecutar inmediatamente al iniciar
  sendGlobalSummary(io, db);
  sendLocationSummaries(io, db);

  // Inicializar intervalos
  appInterval = setInterval(() => {
    const connectedClients = io.sockets.sockets.size;

    if (connectedClients > 0) {
      sendGlobalSummary(io, db);
      sendLocationSummaries(io, db);
    }
  }, TEN_MINUTES);

  console.log('Summary interval started every 10 minutes.');
};

/**
 * Detiene los intervalos de envío de resúmenes.
 */
export const stopSummaryIntervals = () => {
  if (appInterval) {
    clearInterval(appInterval);
    appInterval = null;
    console.log('Summary interval stopped.');
  }
};

/**
 * Devuelve si los intervalos están activos.
 */
export const isSummaryIntervalActive = () => !!appInterval;
