import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../../../config/env.js';
import { UnauthorizedError } from '../../../../shared/domain/errors.js';
import { JwtUserPayload } from '../../../../@types/express.js';
import { ITokenService, TokenPair } from '../../application/ports/token-service.interface.js';

export class JwtTokenService implements ITokenService {
  private readonly accessSecret = env.JWT_ACCESS_SECRET;
  private readonly refreshSecret = env.JWT_REFRESH_SECRET;
  private readonly accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
  private readonly refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;

  generateAccessToken(payload: JwtUserPayload): string {
    const options: SignOptions = {
      expiresIn: this.accessExpiresIn as unknown as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, this.accessSecret, options);
  }

  generateRefreshToken(payload: JwtUserPayload): string {
    const options: SignOptions = {
      expiresIn: this.refreshExpiresIn as unknown as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, this.refreshSecret, options);
  }

  generateTokens(payload: JwtUserPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): JwtUserPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret) as unknown as JwtUserPayload;
      return {
        id: decoded.id,
        role: decoded.role,
        rut: decoded.rut,
      };
    } catch {
      throw new UnauthorizedError('Token de acceso inválido o expirado');
    }
  }

  verifyRefreshToken(token: string): JwtUserPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as unknown as JwtUserPayload;
      return {
        id: decoded.id,
        role: decoded.role,
        rut: decoded.rut,
      };
    } catch {
      throw new UnauthorizedError('Token de refresco inválido o expirado');
    }
  }
}
