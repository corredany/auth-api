import { IAuthRepository } from '../../domain/interfaces/auth/auth.repository.interface';
import { IHashService } from '../../domain/interfaces/auth/hash.service.interface';
import { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { LoginDto, AuthResponseDto } from '../../domain/dtos/auth.dto';
import { CredencialesInvalidasException } from '../../domain/exceptions/auth.exception';

export class LoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    // 1. Buscar usuario por email
    const usuario = await this.authRepository.encontrarUsuarioPorEmail(dto.email);
    if (!usuario) throw new CredencialesInvalidasException();

    // 2. Verificar contraseña
    const contrasenaValida = await this.hashService.verificar(dto.contrasena, usuario.contrasena);
    if (!contrasenaValida) throw new CredencialesInvalidasException();

    // 3. Generar tokens
    const accessToken = this.tokenService.generarAccessToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
    });

    const refreshToken = this.tokenService.generarRefreshToken({ id: usuario.id });

    // 4. Calcular expiración
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    // 5. Guardar refresh token
    await this.authRepository.guardarTokenRefresco({
      token: refreshToken,
      usuarioId: usuario.id,
      expiraEn,
      revocado: false,
      revocadoEn: null,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rolId: usuario.rolId,
      },
    };
  }
}