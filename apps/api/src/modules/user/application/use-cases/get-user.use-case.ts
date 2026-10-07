import { NotFoundError } from '../../../../shared/domain/errors.js';
import { IUserRepository } from '../../domain/user.repository.js';
import { SafeUser } from '../../domain/user.entity.js';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(`Usuario con id '${userId}' no encontrado`);
    }

    return user.toSafeObject();
  }
}
