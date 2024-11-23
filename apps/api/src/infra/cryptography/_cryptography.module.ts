import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    {
      inject: [JwtService],
      provide: JwtEncrypter.name,
      useFactory: (jwtService: JwtService) => new JwtEncrypter(jwtService),
    },
    {
      inject: [],
      provide: BcryptHasher.name,
      useFactory: () => new BcryptHasher(),
    },
  ],
  exports: [JwtEncrypter.name, BcryptHasher.name],
})
export class CryptographyModule {}
