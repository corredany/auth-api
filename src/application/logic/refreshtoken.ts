import { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import {
  TokenInvalidoException,
  TokenRevocadoException,
  UsuarioNoEncontradoException,
} from '../../domain/exceptions/auth.exception';

export class RefreshTokenUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(token: string): Promise<{ accessToken: string }> {
    // 1. Verificar que el token es válido
    const payload = this.tokenService.verificarToken(token);
    if (!payload) throw new TokenInvalidoException();

    // 2. Buscar token en BD
    const tokenRefresco = await this.authRepository.encontrarTokenRefresco(token);
    if (!tokenRefresco) throw new TokenInvalidoException();

    // 3. Verificar que está vigente
    if (!tokenRefresco.estaVigente()) throw new TokenRevocadoException();

    // 4. Buscar usuario
    const usuario = await this.authRepository.encontrarUsuarioPorId(payload.id);
    if (!usuario) throw new UsuarioNoEncontradoException();

    // 5. Generar nuevo access token
    const accessToken = this.tokenService.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    });

    return { accessToken };
  }
}