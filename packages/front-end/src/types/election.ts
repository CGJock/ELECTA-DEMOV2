export interface Incident {
  id: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  status: 'stuck' | 'new' | 'resolved'
  location: { es: string; en: string }
  timestamp: string
}

export interface Candidate {
  id: string
  name: string
  photo: string
  age: number
  experience: { es: string; en: string }
  education: { es: string; en: string }
  proposals: { es: string; en: string }[]
  socials?: {
    threads?: string
    facebook?: string
    instagram?: string
    web?: string
  }
}

export interface PoliticalParty {
  id: string
  name: string
  abbreviation: string
  aliases?: string[]      // <- opcional
  color?: string 
  votes?: number
  count?: number      // <- agregado
  percentage?: string | number
  candidate: Partial<Candidate> 
  disqualified?: boolean
  disqualifiedReason?: string
  withdrawalType?: 'disqualified' | 'withdrawn'
}

export interface ElectionData {
  parties: PoliticalParty[]
  totalVotes: number
  lastUpdate: string
} 