export interface ITokenService {
  generarAccessToken(payload: { id: number; email: string; rolId: number }): string;
  generarRefreshToken(payload: { id: number }): string;
  verificarToken(token: string): { id: number; email: string; rolId: number } | null;
}