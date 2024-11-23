import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDTO, PaginationResponseDTO } from './_pagination.dto';

export class ProcessDisputeRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProcessDisputeCreateRequestDTO extends ProcessDisputeRequestDTO {}

export class ProcessDisputeUpdateRequestDTO {
  @IsString()
  @IsOptional()
  name?: string;
}

export class ProcessDisputeResponseDTO {
  @ApiProperty({ example: 999 })
  id: number;

  @ApiProperty({ example: 'Maisson Saraiva Moreira' })
  name: string;
}

export class ProcessDisputeListQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}

export class ProcessDisputeListResponseDTO extends PaginationResponseDTO<ProcessDisputeResponseDTO> {
  @ApiProperty({ isArray: true, type: ProcessDisputeResponseDTO })
  data: ProcessDisputeResponseDTO[];
}
