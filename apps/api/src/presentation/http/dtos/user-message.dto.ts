import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO, PaginationResponseDTO } from './_pagination.dto';

export class UserMessageRequestDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  destinateId: string;

  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UserMessageCreateRequestDTO extends UserMessageRequestDTO {}

export class UserMessageResponseDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  destinateId: string;

  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  createdAt: Date;
}

export class UserMessageListQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  destinateId?: string;
}

export class UserMessageListResponseDTO extends PaginationResponseDTO<UserMessageResponseDTO> {
  @ApiProperty({ isArray: true, type: UserMessageResponseDTO })
  data: UserMessageResponseDTO[];
}
