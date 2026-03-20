import { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(token: string): Promise<void> {
    await this.authRepository.revocarTokenRefresco(token);
  }
}