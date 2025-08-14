export interface WhitelistUser {
  id: number;
  name: string;
  email: string;
  status: 'approved' | 'denied' | 'pending';
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  notes?: string;
}

export interface CreateWhitelistUserRequest {
  name: string;
  email: string;
  notes?: string;
}

export interface UpdateWhitelistUserRequest {
  name?: string;
  email?: string;
  status?: 'approved' | 'denied' | 'pending';
  notes?: string;
}

export interface WhitelistUserFilters {
  status?: 'approved' | 'denied' | 'pending';
  search?: string;
  page?: number;
  limit?: number;
}

export interface WhitelistUserResponse {
  success: boolean;
  data?: WhitelistUser | WhitelistUser[];
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface WhitelistVerificationRequest {
  name: string;
  email: string;
}

export interface WhitelistVerificationResponse {
  success: boolean;
  allowed: boolean;
  message: string;
  user?: WhitelistUser;
}
