import { SafeUser } from '../../domain/user.entity.js';
import { IUserRepository } from '../../domain/user.repository.js';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => user.toSafeObject());
  }
}
