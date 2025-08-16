import { useMemo } from 'react';

interface Election {
  flag: string;
  countryKey: string;
  date: string;
  whatKey: string;
  systemKey: string;
  parties: Array<{
    nameKey: string;
    candidateKey: string;
  }>;
  summaryKey: string;
  dateKey: string;
}

// Array de elecciones (copiado del componente UncomingElections)
const elections: Election[] = [
  {
    flag: '🇧🇴',
    countryKey: 'bolivia',
    date: '17 agosto 2025',
    whatKey: 'bolivia_what',
    systemKey: 'bolivia_system',
    parties: [
      { nameKey: 'bolivia_andronico', candidateKey: 'bolivia_andronico_candidate' },
      { nameKey: 'bolivia_castillo', candidateKey: 'bolivia_castillo_candidate' },
      { nameKey: 'bolivia_doria', candidateKey: 'bolivia_doria_candidate' },
      { nameKey: 'bolivia_quiroga', candidateKey: 'bolivia_quiroga_candidate' },
    ],
    summaryKey: 'bolivia_summary',
    dateKey: 'bolivia_date',
  },
  {
    flag: '🇰🇷',
    countryKey: 'southKorea',
    date: '3 junio 2025 (elección anticipada)',
    whatKey: 'southKorea_what',
    systemKey: 'southKorea_system',
    parties: [
      { nameKey: 'southKorea_dp', candidateKey: 'southKorea_dp_candidate' },
      { nameKey: 'southKorea_ppp', candidateKey: 'southKorea_ppp_candidate' },
      { nameKey: 'southKorea_rp', candidateKey: 'southKorea_rp_candidate' },
    ],
    summaryKey: 'southKorea_summary',
    dateKey: 'southKorea_date',
  },
  {
    flag: '🇲🇼',
    countryKey: 'malawi',
    date: '16 septiembre 2025',
    whatKey: 'malawi_what',
    systemKey: 'malawi_system',
    parties: [
      { nameKey: 'malawi_mcp', candidateKey: 'malawi_mcp_candidate' },
      { nameKey: 'malawi_dpp', candidateKey: 'malawi_dpp_candidate' },
      { nameKey: 'malawi_pp', candidateKey: 'malawi_pp_candidate' },
    ],
    summaryKey: 'malawi_summary',
    dateKey: 'malawi_date',
  },
  {
    flag: '🇹🇿',
    countryKey: 'tanzania',
    date: '28 octubre 2025',
    whatKey: 'tanzania_what',
    systemKey: 'tanzania_system',
    parties: [
      { nameKey: 'tanzania_ccm', candidateKey: 'tanzania_ccm_candidate' },
      { nameKey: 'tanzania_chadema', candidateKey: 'tanzania_chadema_candidate' },
    ],
    summaryKey: 'tanzania_summary',
    dateKey: 'tanzania_date',
  },
  {
    flag: '🇨🇱',
    countryKey: 'chile',
    date: '16 noviembre 2025',
    whatKey: 'chile_what',
    systemKey: 'chile_system',
    parties: [
      { nameKey: 'chile_right', candidateKey: 'chile_right_candidate' },
      { nameKey: 'chile_left', candidateKey: 'chile_left_candidate' },
    ],
    summaryKey: 'chile_summary',
    dateKey: 'chile_date',
  },
  {
    flag: '🇬🇼',
    countryKey: 'guineaBissau',
    date: '23 noviembre 2025',
    whatKey: 'guineaBissau_what',
    systemKey: 'guineaBissau_system',
    parties: [
      { nameKey: 'guineaBissau_paigc', candidateKey: 'guineaBissau_paigc_candidate' },
      { nameKey: 'guineaBissau_madem', candidateKey: 'guineaBissau_madem_candidate' },
      { nameKey: 'guineaBissau_prs', candidateKey: 'guineaBissau_prs_candidate' },
    ],
    summaryKey: 'guineaBissau_summary',
    dateKey: 'guineaBissau_date',
  },
  {
    flag: '🇨🇷',
    countryKey: 'costaRica',
    date: '1 febrero 2026',
    whatKey: 'costaRica_what',
    systemKey: 'costaRica_system',
    parties: [
      { nameKey: 'costaRica_pln', candidateKey: 'costaRica_pln_candidate' },
      { nameKey: 'costaRica_pusc', candidateKey: 'costaRica_pusc_candidate' },
      { nameKey: 'costaRica_psd', candidateKey: 'costaRica_psd_candidate' },
    ],
    summaryKey: 'costaRica_summary',
    dateKey: 'costaRica_date',
  },
];


export function useNextElectionBanner() {
  const nextElection = useMemo(() => {
    const today = new Date();
    // Parsear la fecha de Bolivia desde el array de elecciones
    const boliviaDateStr = elections[0].date; // "17 agosto 2025"
    const [day, month, year] = boliviaDateStr.split(' ');
    
    // Mapear mes en español a número
    const monthMap: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
      'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const electionDate = new Date(parseInt(year), monthMap[month], parseInt(day));
    
    // Si es el día de la elección
    if (today.toDateString() === electionDate.toDateString()) {
      return { ...elections[0], isElectionDay: true };
    }
    
    // Si es después de la elección
    if (today > electionDate) {
      return null; // No mostrar banner
    }
    
    // Elección futura
    return { ...elections[0], isElectionDay: false };
  }, []);
  
  return nextElection;
}
