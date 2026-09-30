import { Router } from 'express';
import { validate } from '../../../../shared/infrastructure/http/middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import { AuthController } from './auth.controller.js';

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', validate({ body: registerSchema }), authController.register);
  router.post('/login', validate({ body: loginSchema }), authController.login);
  router.post('/refresh', authController.refreshToken);
  router.post('/logout', authController.logout);

  return router;
};
