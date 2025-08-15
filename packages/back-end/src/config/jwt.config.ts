export const JWT_CONFIG = {
  SECRET_KEY : process.env.JWT_TOKEN ,
  EXPIRES_IN: process.env.JWT_EXPIRES,
  ACCESS_CODE: 'ELECTA2024'
};

export interface JWTPayload {
  adminId: number;
  username: string;
  accessCode: string;
}
