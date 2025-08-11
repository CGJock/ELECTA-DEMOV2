export interface Incident {
  id: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  severity: 'low' | 'medium' | 'high'
  location: { es: string; en: string }
  timestamp: string
}

export interface Candidate {
  id: string
  name: string
  photo: string
  age: number
  party: string
  experience: string
  education: string
  proposals: { es: string; en: string }[]
}

export interface PoliticalParty {
  id: string
  name: string
  abbreviation: string
  aliases: string[];
  color: string
  votes?: number
  percentage?: number 
  candidate: Candidate
}

export interface ElectionData {
  parties: PoliticalParty[]
  totalVotes: number
  lastUpdate: string
} 