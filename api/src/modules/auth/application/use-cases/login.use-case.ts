import { UnauthorizedError } from '../../../../shared/domain/errors.js';
import { IUserRepository } from '../../../user/domain/user.repository.js';
import { IPasswordHasher } from '../../../user/application/ports/password-hasher.interface.js';
import { SafeUser } from '../../../user/domain/user.entity.js';
import { ITokenService, TokenPair } from '../ports/token-service.interface.js';

export interface LoginDto {
  email?: string;
  password: string;
}

export interface LoginResult {
  user: SafeUser;
  tokens: TokenPair;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const targetEmail = dto.email ?? '';
    const user = await this.userRepository.findByEmail(targetEmail);
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const tokens = this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
      rut: user.rut,
    });

    return {
      user: user.toSafeObject(),
      tokens,
    };
  }
}
