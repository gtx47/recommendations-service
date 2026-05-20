import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../domain/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async verify(token: string): Promise<{ userId: string; email: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return {
        userId: payload.sub || payload.userId,
        email: payload.email,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
