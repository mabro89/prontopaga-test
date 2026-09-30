import { NotFoundError } from '../../../../shared/domain/errors.js';
import { IUserRepository } from '../../domain/user.repository.js';
import { UserScore } from '../../domain/user-score.interface.js';

export class GetUserScoreUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserScore> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`Usuario con id '${userId}' no encontrado`);
    }

    const numericPart = parseInt(user.rut.replace(/\D/g, ''), 10) || 500;
    const score = 350 + (numericPart % 551);

    return {
      rut: user.rut,
      score,
      date: new Date().toISOString(),
    };
  }
}
