import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDTO, PaginationResponseDTO } from './_pagination.dto';

export class BatchRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class BatchCreateRequestDTO extends BatchRequestDTO {}

export class BatchUpdateRequestDTO {
  @IsString()
  @IsOptional()
  name?: string;
}

export class BatchResponseDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;
}

export class BatchListQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}

export class BatchListResponseDTO extends PaginationResponseDTO<BatchResponseDTO> {
  @ApiProperty({ isArray: true, type: BatchResponseDTO })
  data: BatchResponseDTO[];
}
