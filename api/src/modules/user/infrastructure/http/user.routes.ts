import { Router } from 'express';
import { authenticateJwt } from '../../../../shared/infrastructure/http/middlewares/auth.middleware.js';
import {
  requireRoles,
  requireSelfOrAdmin,
} from '../../../../shared/infrastructure/http/middlewares/role.middleware.js';
import { validate } from '../../../../shared/infrastructure/http/middlewares/validate.middleware.js';
import { createUserSchema, userIdParamSchema } from './user.schemas.js';
import { UserController } from './user.controller.js';

export const createUserRouter = (userController: UserController): Router => {
  const router = Router();

  router.use(authenticateJwt);

  router.get('/me', userController.getMyScore);
  router.get('/me/score', userController.getMyScore);

  router.get('/', requireRoles('ADMIN'), userController.listUsers);

  router.post(
    '/',
    requireRoles('ADMIN'),
    validate({ body: createUserSchema }),
    userController.registerUser,
  );

  router.get(
    '/:id/score',
    validate({ params: userIdParamSchema }),
    requireSelfOrAdmin('id'),
    userController.getUserScore,
  );

  router.get(
    '/:id',
    validate({ params: userIdParamSchema }),
    requireSelfOrAdmin('id'),
    userController.getUser,
  );

  return router;
};
