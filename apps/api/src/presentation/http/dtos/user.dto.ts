import { UserRoleEnum } from '@/domain/enum/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDTO, PaginationResponseDTO } from './_pagination.dto';

export class UserRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserCreateRequestDTO extends UserRequestDTO {}

export class UserUpdateRequestDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  @Type(() => String)
  role?: UserRoleEnum;
}

export class UserResponseDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;

  @ApiProperty({ example: '09476025481' })
  email: string;
}

export class UserListQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}

export class UserListResponseDTO extends PaginationResponseDTO<UserResponseDTO> {
  @ApiProperty({ isArray: true, type: UserResponseDTO })
  data: UserResponseDTO[];
}
