export interface SiteStatus {
  id: number;
  maintenance_mode: boolean;
  private_access: boolean;
  updated_at: Date;
  updated_by?: number;
}

export interface UpdateSiteStatusRequest {
  maintenance_mode?: boolean;
  private_access?: boolean;
}

export interface SiteStatusResponse {
  success: boolean;
  data: SiteStatus;
  message?: string;
}
