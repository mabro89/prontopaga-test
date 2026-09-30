import { SafeUser } from '../../../user/domain/user.entity.js';
import {
  RegisterUserDto,
  RegisterUserUseCase,
} from '../../../user/application/use-cases/register-user.use-case.js';
import { ITokenService, TokenPair } from '../ports/token-service.interface.js';

export interface RegisterResult {
  user: SafeUser;
  tokens: TokenPair;
}

export class RegisterUseCase {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<RegisterResult> {
    const user = await this.registerUserUseCase.execute(dto);

    const tokens = this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
      rut: user.rut,
    });

    return {
      user,
      tokens,
    };
  }
}
