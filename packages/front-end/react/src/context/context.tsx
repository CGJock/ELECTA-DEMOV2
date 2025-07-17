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
  selectedLocationCode: string | null;
  setSelectedLocationCode: (code: string | null) => void;
  timestamp: string | null;
}

const SocketDataContext = createContext<SocketDataContextValue | undefined>(undefined);

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    withCredentials: true,
  });

export const SocketDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [globalSummary, setGlobalSummary] = useState<GlobalSummary | null>(null);
  const [breakdownData, setbreakdownData] = useState<VoteBreakdown | null>(null);
  const [breakdownLocData, setbreakdownLocData] = useState<LocationSummary | null>(null);
  const [selectedLocationCode, setSelectedLocationCode] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null); //se gurdara el timestamp para acreditar los datos
  

  useEffect(() => {
    

    

    // Escuchar resumen en tiempo real desde NOTIFY PostgreSQL
    socket.on('full-vote-data', (data) => {
      console.log(data)
      setbreakdownData({
        totalVotes: data.totalVotes,
        nullVotes: data.nullVotes,
        nullPercent: data.nullPercentage,
        blankVotes: data.blankVotes,
        blankPercent: data.blankPercentage,
        validVotes: data.validVotes,
        validPercent: data.validPercentage,
      });
      setTimestamp(new Date().toISOString());
    });

    //socket that listens to the whole data information + individual party data
    socket.on('total-breakdown-summary', (data) => {
      console.log(`total-brakdownsummary`,data)
      if (!data.error) setGlobalSummary(data);
      setTimestamp(new Date().toISOString());
    });

    // socket.on('total-breakdown-summary', (data) => {
    //   console.log(`total-brakdown-summary`,data)
    //   if (!data.error) setbreakdownData(data);
    // });

     socket.on('location-breakdown-summary', (data) => {
      console.log(`location-breakdown-summary`,data)
      if (!data.error) setbreakdownLocData(data);
      setTimestamp(new Date().toISOString());
    });


    socket.emit('get-total-breakdown');
    socket.emit('get-global-summary');
    socket.emit('get-location-summary',1)

    return () => {
      socket.off('global-vote-summary');
      socket.off('vote-breakdown');
      socket.off('location-breakdown-summary')
      // socket.off('full-vote-data')
    };
  }, []);

  useEffect(() => {
    if (selectedLocationCode !== null) {
      socket.emit('get-location-summary', selectedLocationCode);
    }
  }, [selectedLocationCode]);

  return (
    <SocketDataContext.Provider value={{ globalSummary, breakdownData, breakdownLocData, selectedLocationCode, setSelectedLocationCode, timestamp  }}>
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

