import { InMemoryUserRepository } from './modules/user/infrastructure/repositories/in-memory-user.repository.js';
import { BcryptPasswordHasher } from './modules/user/infrastructure/services/bcrypt-password-hasher.js';
import { JwtTokenService } from './modules/auth/infrastructure/services/jwt-token.service.js';
import { GetUserUseCase } from './modules/user/application/use-cases/get-user.use-case.js';
import { ListUsersUseCase } from './modules/user/application/use-cases/list-users.use-case.js';
import { GetUserScoreUseCase } from './modules/user/application/use-cases/get-user-score.use-case.js';
import { RegisterUserUseCase } from './modules/user/application/use-cases/register-user.use-case.js';
import { UserController } from './modules/user/infrastructure/http/user.controller.js';
import { createUserRouter } from './modules/user/infrastructure/http/user.routes.js';
import { LoginUseCase } from './modules/auth/application/use-cases/login.use-case.js';
import { RegisterUseCase } from './modules/auth/application/use-cases/register.use-case.js';
import { RefreshTokenUseCase } from './modules/auth/application/use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from './modules/auth/application/use-cases/logout.use-case.js';
import { AuthController } from './modules/auth/infrastructure/http/auth.controller.js';
import { createAuthRouter } from './modules/auth/infrastructure/http/auth.routes.js';
import { User } from './modules/user/domain/user.entity.js';
import { randomUUID } from 'node:crypto';

export const buildAppDependencies = () => {
  // 1. Repositorios y Servicios de Infraestructura
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  // 2. Casos de Uso - Módulo User
  const getUserUseCase = new GetUserUseCase(userRepository);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const getUserScoreUseCase = new GetUserScoreUseCase(userRepository);
  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);

  // 3. Controladores y Rutas - Módulo User
  const userController = new UserController(
    getUserUseCase,
    listUsersUseCase,
    getUserScoreUseCase,
    registerUserUseCase,
  );
  const userRouter = createUserRouter(userController);

  // 4. Casos de Uso - Módulo Auth
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);
  const registerUseCase = new RegisterUseCase(registerUserUseCase, tokenService);
  const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenService);
  const logoutUseCase = new LogoutUseCase();

  // 5. Controladores y Rutas - Módulo Auth
  const authController = new AuthController(
    loginUseCase,
    registerUseCase,
    refreshTokenUseCase,
    logoutUseCase,
  );
  const authRouter = createAuthRouter(authController);

  const seedInitialData = async () => {
    const adminPassword = await passwordHasher.hash('Admin123!');
    const userPassword = await passwordHasher.hash('User123!');

    await userRepository.save(
      new User({
        id: randomUUID(),
        email: 'admin@prontopaga.com',
        firstName: 'Admin',
        lastName: 'ProntoPaga',
        rut: '11.111.111-1',
        password: adminPassword,
        role: 'ADMIN',
      }),
    );

    await userRepository.save(
      new User({
        id: randomUUID(),
        email: 'juan.perez@prontopaga.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        rut: '22.222.222-2',
        password: userPassword,
        role: 'USER',
      }),
    );
  };

  return {
    userRepository,
    authRouter,
    userRouter,
    seedInitialData,
  };
};
