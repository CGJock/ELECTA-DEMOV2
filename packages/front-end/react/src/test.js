import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000'; // your Socket.IO backend
const TOTAL_CLIENTS = 10;                   // number of fake clients
const LOCATION_IDS = [1, 2, 3, 4, 5];       // valid location IDs from your DB

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function createClient(clientId) {
  const socket = io(SERVER_URL, {
    reconnection: false,
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log(` Client ${clientId} connected`);

    // Subscribe to a random location
    const randomLocation = LOCATION_IDS[Math.floor(Math.random() * LOCATION_IDS.length)];
    socket.emit('subscribe-to-location', randomLocation);
    console.log(` Client ${clientId} subscribed to location ${randomLocation}`);

    // Listen for location updates
    socket.on('location-breakdown-summary', (data) => {
      console.log(`Client ${clientId} received location summary:`, data);
    });

    // Listen for total breakdown summary
    socket.on('total-breakdown-summary', (data) => {
      console.log(`Client ${clientId} received global summary`,data);
    });

    // Also request global breakdown updates
    socket.emit('get-total-breakdown');
  });

  socket.on('disconnect', () => {
    console.log(` Client ${clientId} disconnected`);
  });

  socket.on('connect_error', (err) => {
    console.log(`Client ${clientId} failed to connect:`, err.message);
  });
}

(async () => {
  console.log(`Launching ${TOTAL_CLIENTS} simulated clients...\n`);
  for (let i = 1; i <= TOTAL_CLIENTS; i++) {
    createClient(i);
    await delay(300); // small delay between clients to simulate real behavior
  }
})();
