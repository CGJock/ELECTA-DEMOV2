'use client'
import { useEffect, useState, useContext, createContext } from "react";
import io from 'socket.io-client';
import { processPartyBreakdown } from '@/utils/partyMapper';

interface VoteBreakdown {
  totalVotes: number;
  nullVotes: number;
  nullPercent: number;
  blankVotes: number;
  blankPercent: number;
  validVotes: number;
  validPercent: number;
}

interface PartyData {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
}

interface GlobalSummary {
  totalVotes: number;
  partyBreakdown: PartyData[];
}

interface LocationSummary {
  locationCode: string;
  locationName: string;
  totalVotes: number;
  partyBreakdown: PartyData[];
}

interface SocketDataContextValue {
  globalSummary: GlobalSummary | null;
  breakdownData: VoteBreakdown | null;
  breakdownLocData: LocationSummary | null;
  setbreakdownLocData: (data: LocationSummary | null) => void;
  selectedLocationCode: string | null;
  setSelectedLocationCode: (code: string | null) => void;
  isConnected: boolean;
  timestamp: string | null;
}

// Crear el contexto con un valor por defecto completo
const defaultContextValue: SocketDataContextValue = {
  globalSummary: null,
  breakdownData: null,
  breakdownLocData: null,
  setbreakdownLocData: () => {},
  selectedLocationCode: null,
  setSelectedLocationCode: () => {},
  isConnected: false,
  timestamp: null,
};

const SocketDataContext = createContext<SocketDataContextValue>(defaultContextValue);

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const socket = io(socketUrl, {
  withCredentials: true,
});

export default socket;

export const SocketDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalSummary, setglobalSummary] = useState<GlobalSummary | null>(null);
  const [breakdownData, setbreakdownData] = useState<VoteBreakdown | null>(null);
  const [breakdownLocData, setbreakdownLocData] = useState<LocationSummary | null>(null);
  const [selectedLocationCode, setSelectedLocationCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    function handleConnect() {
      console.log('Socket connected');
      setIsConnected(true);
    }

    function handleDisconnect() {
      console.log('Socket disconnected');
      setIsConnected(false);
    }

    function handleFullVoteData(data: VoteBreakdown) {
      if (!('error' in data)) {
        setbreakdownData(data);
        setTimestamp(new Date().toISOString());
      }
    }

    function handleTotalBreakdownSummary(data: GlobalSummary) {
      if (!('error' in data)) {
        setglobalSummary(data);
        setTimestamp(new Date().toISOString());
      }
    }

    function handleLocationBreakdownSummary(data: LocationSummary) {
      if (!('error' in data)) {
        setbreakdownLocData(data);
        setTimestamp(new Date().toISOString());
      }
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('full-vote-data', handleFullVoteData);
    socket.on('total-breakdown-summary', handleTotalBreakdownSummary);
    socket.on('location-breakdown-summary', handleLocationBreakdownSummary);
    socket.on('initial-vote-summary', (data) => {
      setglobalSummary(data);
    });

    socket.emit('get-total-breakdown');

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('full-vote-data', handleFullVoteData);
      socket.off('total-breakdown-summary', handleTotalBreakdownSummary);
      socket.off('location-breakdown-summary', handleLocationBreakdownSummary);
    };
  }, []);

  useEffect(() => {
    if (selectedLocationCode !== null) {
      socket.emit('get-location-summary', selectedLocationCode);
    }
  }, [selectedLocationCode]);

  const contextValue: SocketDataContextValue = {
    globalSummary,
    breakdownData,
    breakdownLocData,
    setbreakdownLocData,
    selectedLocationCode,
    setSelectedLocationCode,
    isConnected,
    timestamp,
  };

  // Alternativa con JSX y type assertion
  const Provider = SocketDataContext.Provider as any;
  
  return (
    <Provider value={contextValue}>
      {children}
    </Provider>
  );
};

export function useSocketData() {
  const context = useContext(SocketDataContext);
  if (!context) {
    throw new Error('useSocketData must be used within a SocketDataProvider');
  }
  return context;
}