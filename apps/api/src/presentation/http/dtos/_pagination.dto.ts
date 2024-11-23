import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsInt({ message: 'currentPage must be an integer' })
  @Min(1, { message: 'currentPage must be at least 1' })
  currentPage: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value !== undefined ? Number(value) : 20))
  @IsInt({ message: 'perPage must be an integer' })
  perPage: number = 20;
}

export abstract class PaginationResponseDTO<T> {
  abstract data: T[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  lastPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;
}
