import { Request, Response, NextFunction, CookieOptions } from 'express';
import { env } from '../../../../config/env.js';
import { UnauthorizedError } from '../../../../shared/domain/errors.js';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { RegisterUseCase } from '../../application/use-cases/register.use-case.js';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case.js';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.loginUseCase.execute(req.body);

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        status: 'success',
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, tokens } = await this.registerUseCase.execute(req.body);

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, getRefreshCookieOptions());

      res.status(201).json({
        status: 'success',
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] || req.body?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError('Sin refresh token');
      }

      const tokens = await this.refreshTokenUseCase.execute({ refreshToken });

      res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.logoutUseCase.execute();

      res.clearCookie(REFRESH_TOKEN_COOKIE, {
        path: '/api/auth/refresh',
      });

      res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada',
      });
    } catch (error) {
      next(error);
    }
  };
}
