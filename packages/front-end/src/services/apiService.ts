// API Service para consumir endpoints REST del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Department {
  code: string;
  name: string;
}

export interface VoteSummary {
  totalVotes: number;
  nullVotes: number;
  nullPercentage: number;
  blankVotes: number;
  blankPercentage: number;
  validVotes: number;
  validPercentage: number;
}

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: string;
}

export interface GlobalSummary {
  totalVotes: number;
  blankVotes: number;
  nullVotes: number;
  partyBreakdown: PartySummary[];
}

export interface LocationSummary {
  locationCode: string;
  locationName: string;
  totalVotes: number;
  partyBreakdown: PartySummary[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // GET /api/departments
  async getDepartments(): Promise<Department[]> {
    try {
      const response = await fetch(`${this.baseUrl}/departments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // GET departamento específico
  async getDepartmentByCode(code: string): Promise<Department | null> {
    try {
      const departments = await this.getDepartments();
      return departments.find(dept => dept.code === code) || null;
    } catch (error) {
      console.error(`Error fetching department ${code}:`, error);
      throw error;
    }
  }

  // POST /api/votes (para actualizar votos)
  async updateVotes(voteData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify(voteData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating votes:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 