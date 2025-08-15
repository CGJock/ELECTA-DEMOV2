// WebSocket Service para consumir eventos del backend
// import { io, Socket } from 'socket.io-client';
// import type { VoteSummary, GlobalSummary, LocationSummary } from './apiService';

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

// export interface SocketEvents {
//   'vote-breakdown': (data: VoteSummary) => void;
//   'global-vote-summary': (data: GlobalSummary) => void;
//   'location-breakdown-summary': (data: LocationSummary) => void;
//   'candidate-proposals': (data: { candidateId: string; proposals: any[] }) => void;
//   'parties-candidates': (data: any[]) => void;
// }

// export interface SocketEmitters {
//   'get-vote-breakdown': () => void;
//   'get-global-summary': () => void;
//   'get-location-summary': (locationId: string) => void;
//   'get-candidate-proposals': (data: { candidateId: string; language?: string }) => void;
//   'get-parties-candidates': () => void;
// }

// class SocketService {
//   private socket: Socket | null = null;
//   private isConnected = false;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000;

//   constructor() {
//     this.initializeSocket();
//   }

//   private initializeSocket() {
//     try {
//       this.socket = io(SOCKET_URL, {
//         transports: ['websocket', 'polling'],
//         timeout: 20000,
//         reconnection: true,
//         reconnectionAttempts: this.maxReconnectAttempts,
//         reconnectionDelay: this.reconnectDelay,
//       });

//       this.setupEventListeners();
//     } catch (error) {
//       console.error('Error initializing socket:', error);
//     }
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     this.socket.on('connect', () => {
//       console.log('Socket connected:', this.socket?.id);
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       this.isConnected = false;
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       this.isConnected = false;
//       this.reconnectAttempts++;
      
//       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//         console.error('Max reconnection attempts reached');
//       }
//     });
//   }

//   // Método para emitir eventos
//   emit<T extends keyof SocketEmitters>(event: T, ...args: Parameters<SocketEmitters[T]>) {
//     if (!this.socket || !this.isConnected) {
//       console.warn('Socket not connected, cannot emit event:', event);
//       return;
//     }
    
//     this.socket.emit(event, ...args);
//   }

//   // Método para escuchar eventos
//   on<T extends keyof SocketEvents>(event: T, callback: SocketEvents[T]) {
//     if (!this.socket) {
//       console.warn('Socket not initialized, cannot listen to event:', event);
//       return;
//     }
    
//     this.socket.on(event, callback as any);
//   }

//   // Método para dejar de escuchar eventos
//   off<T extends keyof SocketEvents>(event: T, callback?: SocketEvents[T]) {
//     if (!this.socket) return;
    
//     if (callback) {
//       this.socket.off(event, callback as any);
//     } else {
//       this.socket.off(event);
//     }
//   }

//   // Método para desconectar
//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnected = false;
//     }
//   }

//   // Método para verificar si está conectado
//   get connected(): boolean {
//     return this.isConnected;
//   }

//   // Método para obtener el ID del socket
//   get socketId(): string | undefined {
//     return this.socket?.id;
//   }
// }

// export const socketService = new SocketService(); 