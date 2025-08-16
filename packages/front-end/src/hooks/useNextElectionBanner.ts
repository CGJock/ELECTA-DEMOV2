import { useMemo } from 'react';

interface NextElection {
  countryKey: string;
  date: string;
  isElectionDay: boolean;
}

export function useNextElectionBanner(): NextElection | null {
  const nextElection = useMemo(() => {
    const today = new Date();
    
    // Solo los datos mínimos que necesita el banner
    const boliviaElection = {
      countryKey: 'bolivia',
      date: '17 agosto 2025'
    };
    
    // Parsear la fecha de Bolivia
    const [day, month, year] = boliviaElection.date.split(' ');
    
    // Mapear mes en español a número
    const monthMap: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
      'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const electionDate = new Date(parseInt(year), monthMap[month], parseInt(day));
    
    // Si es el día de la elección
    if (today.toDateString() === electionDate.toDateString()) {
      return { ...boliviaElection, isElectionDay: true };
    }
    
    // Si es después de la elección
    if (today > electionDate) {
      return null; // No mostrar banner
    }
    
    // Elección futura
    return { ...boliviaElection, isElectionDay: false };
  }, []);
  
  return nextElection;
}
