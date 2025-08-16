"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//logs only in dev, change to see the logs in prod
if (process.env.NODE_ENV === 'production') {
    console.log = () => { };
}
require("./register-tsconfig-paths.js");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = __importDefault(require("@db/db.js"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const security_js_1 = require("./src/middlewares/security.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_js_1 = __importDefault(require("@db/redis.js"));
//endpoint routes
const departments_js_1 = __importDefault(require("@routes/departments.js"));
const newUpdate_js_1 = __importDefault(require("@routes/newUpdate.js"));
const getMails_js_1 = __importDefault(require("@routes/getMails.js"));
const postEmail_js_1 = __importDefault(require("@routes/postEmail.js"));
const getBallots_js_1 = __importDefault(require("@routes/getBallots.js"));
const getIdBallot_js_1 = __importDefault(require("@routes/getIdBallot.js"));
// Sistema de Elecciones (Developer)
const getElectionType_js_1 = __importDefault(require("@routes/getElectionType.js"));
const getCountries_js_1 = __importDefault(require("@routes/getCountries.js"));
const createElection_js_1 = __importDefault(require("@routes/createElection.js"));
const getActiveElectionFull_js_1 = __importDefault(require("@routes/getActiveElectionFull.js"));
const setActiveElection_js_1 = __importDefault(require("@routes/setActiveElection.js"));
const getAllElectionRounds_js_1 = __importDefault(require("@routes/getAllElectionRounds.js"));
const getActiveElection_js_1 = __importDefault(require("@routes/getActiveElection.js"));
// Sistema de Autenticación y Admin (Tus cambios)
const auth_js_1 = __importDefault(require("@routes/auth.js"));
const whitelist_js_1 = __importDefault(require("@routes/whitelist.js"));
const siteStatus_js_1 = __importDefault(require("@routes/siteStatus.js"));
const adminManagement_js_1 = __importDefault(require("@routes/adminManagement.js"));
const componentVisibility_js_1 = __importDefault(require("@routes/componentVisibility.js"));
// Utilidades y Configuración
const migrate_js_1 = require("@db/migrate.js");
const listenVotes_js_1 = require("@listeners/listenVotes.js");
const setupSocketHandlers_js_1 = require("@socket/setupSocketHandlers.js");
const intervalManager_js_1 = require("@utils/intervalManager.js");
const redis_streams_adapter_1 = require("@socket.io/redis-streams-adapter");
dotenv_1.default.config();
async function main() {
    const client_url = process.env.CLIENT_URL || 'http://localhost:3001';
    const PORT = process.env.PORT || 5000;
    // Run DB migrations first
    console.log('Ejecutando migraciones...');
    await (0, migrate_js_1.runMigrations)();
    console.log('Migraciones completadas.');
    // Create Express app
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, cookie_parser_1.default)());
    app.set('trust proxy', 1);
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: [client_url, 'http://localhost:3001', 'http://localhost:3000'],
        credentials: true,
    }));
    app.use(security_js_1.useHelmet);
    // Routes
    app.use('/api/departments', departments_js_1.default);
    app.use('/api/votes', newUpdate_js_1.default);
    // Connect Redis using ioredis
    try {
        // Verificar que Redis esté disponible
        await redis_js_1.default.ping();
        console.log('Redis Conexión establecida correctamente');
    }
    catch (error) {
        console.warn('redis not conected, :', error.message);
    }
    app.use('/api/get-emails', getMails_js_1.default);
    app.use('/api/post-emails', postEmail_js_1.default);
    app.use('/api/get-ballot_id', getIdBallot_js_1.default);
    app.use('/api/get-ballots', getBallots_js_1.default);
    // Sistema de Autenticación y Admin (Tus cambios)
    app.use('/api/auth', auth_js_1.default);
    app.use('/api/whitelist', whitelist_js_1.default);
    app.use('/api/site-status', siteStatus_js_1.default);
    app.use('/api/admin-management', adminManagement_js_1.default);
    app.use('/api/component-visibility', componentVisibility_js_1.default);
    // Sistema de Elecciones (Developer)
    app.use('/api/get-election-types', getElectionType_js_1.default);
    app.use('/api/post-election', createElection_js_1.default);
    app.use('/api/get-countries', getCountries_js_1.default);
    app.use('/api/get_full-active_election', getActiveElectionFull_js_1.default);
    app.use('/api/get-all-election-rounds', getAllElectionRounds_js_1.default);
    app.use('/api/post-active-election', setActiveElection_js_1.default);
    app.use('/api/get-active_election', getActiveElection_js_1.default);
    // Setup Socket.IO server
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [client_url, 'http://localhost:3001', 'http://localhost:3000'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // Use the redis-streams-adapter
    io.adapter((0, redis_streams_adapter_1.createAdapter)(redis_js_1.default));
    // Custom handlers
    (0, setupSocketHandlers_js_1.setupSocketHandlers)(io, db_js_1.default);
    (0, listenVotes_js_1.listenToVotesChanges)(db_js_1.default, io);
    setInterval(() => {
        console.log('Clientes conectados actualmente:', io.sockets.sockets.size);
    }, 6000 * 2);
    //stops intervals and close all conections
    const ShutdownServer = async () => {
        console.log('Cerrando servidor...');
        (0, intervalManager_js_1.stopSummaryIntervals)(); // stops intervals
        try {
            await redis_js_1.default.quit(); // closes redis connection
            console.log('✅ [Redis] Conexión cerrada correctamente');
        }
        catch (error) {
            console.warn('⚠️ [Redis] Error al cerrar conexión Redis:', error.message);
        }
        await db_js_1.default.end(); // closes Postgres conection
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
