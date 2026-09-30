import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../../shared/domain/errors.js';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case.js';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case.js';
import { GetUserScoreUseCase } from '../../application/use-cases/get-user-score.use-case.js';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';

export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserScoreUseCase: GetUserScoreUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  listUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.listUsersUseCase.execute();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scoreData = await this.getUserScoreUseCase.execute(req.params.id);
      res.status(200).json({
        status: 'success',
        data: scoreData,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const scoreData = await this.getUserScoreUseCase.execute(req.user.id);
      res.status(200).json({
        status: 'success',
        data: scoreData,
      });
    } catch (error) {
      next(error);
    }
  };

  registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
