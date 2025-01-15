import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateSessionInputDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserSessionOutputDTO {
  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;
}

export class AuthenticateSessionOutputDTO {
  @ApiProperty({ example: 'John Doe' })
  user: UserSessionOutputDTO;

  @ApiProperty({
    example: 'klqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEzcXZ',
  })
  access_token: string;
}
