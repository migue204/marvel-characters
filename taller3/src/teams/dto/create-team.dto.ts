import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional,
  IsString, Max, MaxLength, Min,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Defenders' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: "Hell's Kitchen, New York", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  base?: string | null;

  @ApiPropertyOptional({ example: 1971, minimum: 1900, maximum: 2100, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  founded_year?: number | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ type: [Number], example: [16] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  characterIds?: number[];
}