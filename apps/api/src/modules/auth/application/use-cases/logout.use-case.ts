export class LogoutUseCase {
  async execute(): Promise<void> {
    // Si en el futuro se implementa una lista negra (blacklist) o revocación en Redis/BD,
    // se invoca aquí el puerto correspondiente.
    return Promise.resolve();
  }
}
