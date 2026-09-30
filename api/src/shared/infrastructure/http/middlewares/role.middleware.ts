import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../domain/errors.js';
import { UserRole } from '../../../../modules/user/domain/user.entity.js';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('No posee los permisos necesarios para realizar esta acción');
    }

    next();
  };
};

export const requireSelfOrAdmin = (paramName = 'id') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    const isSelf = req.user.id === req.params[paramName];
    const isAdmin = req.user.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      throw new ForbiddenError('Solo el propio usuario puede acceder a este recurso');
    }

    next();
  };
};
