export const JWT_CONFIG = {
  SECRET_KEY: 'your-super-secret-jwt-key-change-in-production',
  EXPIRES_IN: '24h',
  ACCESS_CODE: 'ELECTA2024'
};

export interface JWTPayload {
  adminId: number;
  username: string;
  accessCode: string;
}
