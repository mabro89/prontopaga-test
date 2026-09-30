export type UserRole = 'ADMIN' | 'USER';

export interface UserProps {
  id: string;
  correo: string;
  firstName: string;
  lastName: string;
  rut: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<UserProps, 'password'>;

export class User {
  public readonly id: string;
  public readonly correo: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly rut: string;
  public password: string;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.correo = props.correo.toLowerCase().trim();
    this.firstName = props.firstName.trim();
    this.lastName = props.lastName.trim();
    this.rut = props.rut.trim();
    this.password = props.password;
    this.role = props.role ?? 'USER';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public toSafeObject(): SafeUser {
    return {
      id: this.id,
      correo: this.correo,
      firstName: this.firstName,
      lastName: this.lastName,
      rut: this.rut,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
