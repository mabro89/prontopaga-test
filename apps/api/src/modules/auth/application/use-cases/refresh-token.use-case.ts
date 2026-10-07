import { UnauthorizedError } from '../../../../shared/domain/errors.js';
import { IUserRepository } from '../../../user/domain/user.repository.js';
import { ITokenService, TokenPair } from '../ports/token-service.interface.js';

export interface RefreshTokenDto {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<TokenPair> {
    if (!dto.refreshToken) {
      throw new UnauthorizedError('Token de refresco requerido');
    }

    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);

    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new UnauthorizedError('El usuario asociado al token ya no existe');
    }

    return this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
      rut: user.rut,
    });
  }
}
