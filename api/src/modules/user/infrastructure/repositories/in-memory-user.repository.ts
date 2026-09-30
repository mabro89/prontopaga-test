import { IUserRepository } from '../../domain/user.repository.js';
import { User } from '../../domain/user.entity.js';

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? this.clone(user) : null;
  }

  async findByEmail(correo: string): Promise<User | null> {
    const normalized = correo.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.correo.toLowerCase() === normalized) {
        return this.clone(user);
      }
    }
    return null;
  }

  async findByRut(rut: string): Promise<User | null> {
    const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    for (const user of this.users.values()) {
      const existingClean = user.rut.replace(/[^0-9kK]/g, '').toUpperCase();
      if (existingClean === cleanRut) {
        return this.clone(user);
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values()).map((u) => this.clone(u));
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, this.clone(user));
  }

  private clone(user: User): User {
    return new User({
      id: user.id,
      correo: user.correo,
      firstName: user.firstName,
      lastName: user.lastName,
      rut: user.rut,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
