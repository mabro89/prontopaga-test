import { randomUUID } from 'crypto';
import { ConflictError } from '../../../../shared/domain/errors.js';
import { SafeUser, User, UserRole } from '../../domain/user.entity.js';
import { IUserRepository } from '../../domain/user.repository.js';
import { IPasswordHasher } from '../ports/password-hasher.interface.js';

export interface RegisterUserDto {
  correo: string;
  firstName: string;
  lastName: string;
  rut: string;
  password: string;
  role?: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<SafeUser> {
    const existingByEmail = await this.userRepository.findByEmail(dto.correo);
    if (existingByEmail) {
      throw new ConflictError('El correo electrónico ya se esta en uso');
    }

    const existingByRut = await this.userRepository.findByRut(dto.rut);
    if (existingByRut) {
      throw new ConflictError('El RUT ya esta en uso');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User({
      id: randomUUID(),
      correo: dto.correo,
      firstName: dto.firstName,
      lastName: dto.lastName,
      rut: dto.rut,
      password: hashedPassword,
      role: dto.role ?? 'USER',
    });

    await this.userRepository.save(user);

    return user.toSafeObject();
  }
}
