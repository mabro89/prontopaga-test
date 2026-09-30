import { User } from './user.entity.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(correo: string): Promise<User | null>;
  findByRut(rut: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
}
