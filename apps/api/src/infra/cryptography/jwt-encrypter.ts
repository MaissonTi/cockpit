import { IJwtEncrypter } from '@/domain/protocols/cryptography/jwt-encrypter.interface';
import { JwtService } from '@nestjs/jwt';

export class JwtEncrypter implements IJwtEncrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 60,
    });
  }
}
