import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

// Singleton socket instance
let socket: Socket | undefined;

export function getSocket() {
  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

/**
 * Hook para gestionar socket y listeners de forma segura
 * @param handlers objeto con eventos y funciones manejadoras
 * @param emitAfterListeners opcional, evento y datos para emitir después de registrar listeners
 */
export function useSocket(
  handlers: { [event: string]: (...args: any[]) => void },
  initialEmit?: { event: string; data?: any }
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    // Registrar listeners
    for (const event in handlers) {
      socket.on(event, handlers[event]);
    }

    // Al conectar (o reconectar), emitir el evento inicial si existe
    const onConnect = () => {
      if (initialEmit) {
        socket.emit(initialEmit.event, initialEmit.data);
      }
    };
    socket.on('connect', onConnect);

    return () => {
      // Limpiar listeners
      for (const event in handlers) {
        socket.off(event, handlers[event]);
      }
      socket.off('connect', onConnect);
      // Nota: NO desconectar socket aquí, para que la conexión sobreviva al desmontaje
    };
  }, [handlers, initialEmit]);
}