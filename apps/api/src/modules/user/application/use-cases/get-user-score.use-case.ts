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

    return this.calculateScore(user.rut);
  }

  async executeByRut(rut: string): Promise<UserScore> {
    const user = await this.userRepository.findByRut(rut);

    if (!user) {
      throw new NotFoundError(`Usuario con RUT '${rut}' no encontrado`);
    }

    return this.calculateScore(user.rut);
  }

  private calculateScore(rut: string): UserScore {
    const numericPart = parseInt(rut.replace(/\D/g, ''), 10) || 500;
    const score = 350 + (numericPart % 551);

    return {
      rut,
      score,
      date: new Date().toISOString(),
    };
  }
}
