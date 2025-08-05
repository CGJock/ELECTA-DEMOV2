'use client'
import { useEffect,useState,useContext,createContext } from "react";
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
  const [timestamp, setTimestamp] = useState<string | null>(null); //timestamp to check data consistency
  
  
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
    // Regsiter listeners before emitting

    //show information related to plain votes
    function handleFullVoteData(data: VoteBreakdown) {
      if (!('error' in data)) {
        setbreakdownData(data);
        setTimestamp(new Date().toISOString());
      }
    }

    //show information reltaed to partydatabreakdown
    function handleTotalBreakdownSummary(data: GlobalSummary) {
      if (!('error' in data)) {
        setglobalSummary(data);
        setTimestamp(new Date().toISOString());
      }
    }

    //show information reltaed to partydatabreakdown by location
    function handleLocationBreakdownSummary(data: LocationSummary) {
      if (!('error' in data)) {
        setbreakdownLocData(data);
        setTimestamp(new Date().toISOString());
      }
    }

    socket.on('full-vote-data', handleFullVoteData);
    socket.on('total-breakdown-summary', handleTotalBreakdownSummary);
    socket.on('location-breakdown-summary', handleLocationBreakdownSummary);
    socket.on('initial-vote-summary', (data) => {
    setglobalSummary(data);
  });

    // emits the request after the listeners
    // socket.emit('get-total-breakdown');

    // Limpieza al desmontar
    return () => {
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

