'use client'
import { useEffect,useState,useContext,createContext } from "react";
import { useSocket, getSocket } from '@contexts/useSocket';
import io from 'socket.io-client';

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
  politicalParties: PartyData[];
  
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
  
  timestamp: string | null;
}

const SocketDataContext = createContext<SocketDataContextValue | undefined>(undefined);

// const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
// const socket = io(socketUrl, {
//     withCredentials: true,
//   });



export const SocketDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [globalSummary, setglobalSummary] = useState<GlobalSummary | null>(null);
  const [breakdownData, setbreakdownData] = useState<VoteBreakdown | null>(null);
  const [breakdownLocData, setbreakdownLocData] = useState<LocationSummary | null>(null);
  const [selectedLocationCode, setSelectedLocationCode] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null); //timestamp to check data consistency
  

   const handlers = {
    'full-vote-data': (data: VoteBreakdown) => {
      if (!('error' in data)) {
        setbreakdownData(data);
        setTimestamp(new Date().toISOString());
      }
    },
    'total-breakdown-summary': (data: GlobalSummary) => {
      if (!('error' in data)) {
        setglobalSummary(data);
        setTimestamp(new Date().toISOString());
      }
    },
    'location-breakdown-summary': (data: LocationSummary) => {
      if (!('error' in data)) {
        setbreakdownLocData(data);
        setTimestamp(new Date().toISOString());
      }
    },
    'initial-vote-summary': (data: GlobalSummary) => {
      setglobalSummary(data);
    }
  };

  // Usar el hook useSocket para manejar el socket y listeners
  useSocket(handlers, { event: 'get-total-breakdown' });

  // Cuando cambia selectedLocationCode, emitimos para obtener datos de esa locación
  useEffect(() => {
    if (selectedLocationCode !== null) {
      const socket = getSocket();
      socket.emit('get-location-summary', selectedLocationCode);
    }
  }, [selectedLocationCode]);

  return (
    <SocketDataContext.Provider value={{ globalSummary, breakdownData, breakdownLocData, setbreakdownLocData, selectedLocationCode, setSelectedLocationCode, timestamp  }}>
      {children}
    </SocketDataContext.Provider>
  );
};

export function useSocketData() {
  const context = useContext(SocketDataContext);
  if (!context) {
    throw new Error('useSocketData must be used within a SocketDataProvider');
  }
  return context;
}