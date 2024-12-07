import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDTO, PaginationResponseDTO } from './_pagination.dto';

export class BatchBidsRequestDTO {
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  value: number;
}
export class BatchBidsCreateRequestDTO extends BatchBidsRequestDTO {}

export class BatchBidsUpdateRequestDTO {
  @IsBoolean()
  @IsOptional()
  isDecline?: boolean;
}

export class BatchBidsResponseDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;
}

export class BatchBidsListQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}

export class BatchBidsListResponseDTO extends PaginationResponseDTO<BatchBidsResponseDTO> {
  @ApiProperty({ isArray: true, type: BatchBidsResponseDTO })
  data: BatchBidsResponseDTO[];
}
