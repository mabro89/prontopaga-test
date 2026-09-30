import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../domain/errors.js';
import { JwtTokenService } from '../../../../modules/auth/infrastructure/services/jwt-token.service.js';

const tokenService = new JwtTokenService();

export const authenticateJwt = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Encabezado Authorization faltante o con formato inválido');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError('Token no proporcionado');
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
