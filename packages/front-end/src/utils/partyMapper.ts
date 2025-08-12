import { mockParties } from '@/data/mockData';

/**
 * Mapea una abreviatura de partido a su nombre completo usando los aliases
 * @param abbr - La abreviatura del partido (ej: "MAS-IPSP", "ALIANZA POPULAR")
 * @returns El nombre completo del partido o la abreviatura si no se encuentra
 */
export function mapPartyAbbrToName(abbr: string): string {
  if (!abbr) return abbr;
  
  const normalizedAbbr = abbr.trim().toLowerCase();
  
  const party = mockParties.find(p => {
    if (!p.aliases || p.aliases.length === 0) {
      return p.abbreviation.toLowerCase() === normalizedAbbr;
    }
    
    return p.aliases.some(alias => 
      alias.trim().toLowerCase() === normalizedAbbr
    );
  });
  
  return party ? party.name : abbr;
}

/**
 * Procesa un array de partyBreakdown para reemplazar nombres "UNDEFINED" con nombres completos
 * @param partyBreakdown - Array de partidos con datos de votos
 * @returns Array procesado con nombres correctos
 */
export function processPartyBreakdown(partyBreakdown: any[]): any[] {
  if (!Array.isArray(partyBreakdown)) return partyBreakdown;
  
  return partyBreakdown.map(party => ({
    ...party,
    name: party.name === 'UNDEFINED' ? mapPartyAbbrToName(party.abbr) : party.name
  }));
} 