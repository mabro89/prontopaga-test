import { JwtUserPayload } from '../../../../@types/express.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generateAccessToken(payload: JwtUserPayload): string;
  generateRefreshToken(payload: JwtUserPayload): string;
  generateTokens(payload: JwtUserPayload): TokenPair;
  verifyAccessToken(token: string): JwtUserPayload;
  verifyRefreshToken(token: string): JwtUserPayload;
}
