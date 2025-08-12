'use client'
import { useEffect,useState,useContext,createContext } from "react";
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
  isConnected: boolean;
  timestamp: string | null;
}

const SocketDataContext = createContext<SocketDataContextValue | undefined>(undefined);

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const socket = io(socketUrl, {
    withCredentials: true,
  });

export default socket;

export const SocketDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [globalSummary, setglobalSummary] = useState<GlobalSummary | null>(null);
  const [breakdownData, setbreakdownData] = useState<VoteBreakdown | null>(null);
  const [breakdownLocData, setbreakdownLocData] = useState<LocationSummary | null>(null);
  const [selectedLocationCode, setSelectedLocationCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null); // timestamp to check data consistency
  
  
  //   useEffect(() => {
  // socket.emit('get-total-breakdown');
 
  // }, []);

  // useEffect(() => {
    

  //   console.log(selectedLocationCode)

  //   // Escuchar resumen en tiempo real desde NOTIFY PostgreSQL
  //   socket.on('full-vote-data', (data) => {
  //     console.log('full-vote-data-context',data)
  //     if (!data.error)
  //     setbreakdownData(data);
  //   console.log('vote-data-contexto',breakdownData)
  //     setTimestamp(new Date().toISOString());
      
  //   });

  //   //socket that listens to the whole data information + individual party data
  //   socket.on('total-breakdown-summary', (data) => {
  //     console.log(`total-brakdownsummary`,data)
  //     if (!data.error) setglobalSummary(data);
  //     setTimestamp(new Date().toISOString());
  //   });

  //    socket.on('location-breakdown-summary', (data) => {
  //     if (!data.error) setbreakdownLocData(data);
  //     setTimestamp(new Date().toISOString());
  //   });


  

  //   return () => {
  //     socket.off('global-vote-summary');
  //     socket.off('total-breakdown-summary');
  //     socket.off('location-breakdown-summary')
  //     socket.off('full-vote-data')
  //   };
  // }, []);

  useEffect(() => {
    // Register listeners before emitting

    // Handle connection status
    function handleConnect() {
      console.log('Socket connected');
      setIsConnected(true);
    }

    function handleDisconnect() {
      console.log('Socket disconnected');
      setIsConnected(false);
    }

    // Show information related to plain votes
    function handleFullVoteData(data: VoteBreakdown) {
      if (!('error' in data)) {
        setbreakdownData(data);
        console.log('breakdowndata',data)
        setTimestamp(new Date().toISOString());
      }
    }

    // Show information related to party data breakdown
    function handleTotalBreakdownSummary(data: GlobalSummary) {
      if (!('error' in data)) {
        setglobalSummary(data);
        console.log('log por breakdownloc',data)
        setTimestamp(new Date().toISOString());
      }
    }

    // Show information related to party data breakdown by location
    function handleLocationBreakdownSummary(data: LocationSummary) {
      if (!('error' in data)) {
        setbreakdownLocData(data);
        setTimestamp(new Date().toISOString());
      }
    }

    // Set up connection listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set up data listeners
    socket.on('full-vote-data', handleFullVoteData);
    socket.on('total-breakdown-summary', handleTotalBreakdownSummary);
    socket.on('location-breakdown-summary', handleLocationBreakdownSummary);
    socket.on('initial-vote-summary', (data) => {
      setglobalSummary(data);
    });

    // Emit the request after the listeners
    socket.emit('get-total-breakdown');

    // Cleanup on unmount
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

  return (
    <SocketDataContext.Provider value={{ globalSummary, breakdownData, breakdownLocData, setbreakdownLocData, selectedLocationCode, setSelectedLocationCode, isConnected, timestamp  }}>
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

