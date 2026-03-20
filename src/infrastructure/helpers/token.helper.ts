import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/interfaces/auth/token.service.interface';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class TokenHelper implements ITokenService {
  generarAccessToken(payload: { id: number; email: string; rolId: number }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.accessTokenExpiration as any,
    });
  }

  generarRefreshToken(payload: { id: number }): string {
    return jwt.sign(payload, jwtConfig.secret as string, {
      expiresIn: jwtConfig.refreshTokenExpiration as any,
    });
  }

  verificarToken(token: string): { id: number; email: string; rolId: number } | null {
    try {
      return jwt.verify(token, jwtConfig.secret as string) as any;
    } catch {
      return null;
    }
  }
}