import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional,IsString, Max, MaxLength, Min,} from 'class-validator';
import { CharacterStatus } from '../entities/character.entity.js';

export class CreateCharacterDto {
  @ApiProperty({ example: 'Peter Parker' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  real_name: string;

  @ApiProperty({ example: 'Spider-Man' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias: string;

  @ApiProperty({ example: 'Spider-sense and agility' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  main_power: string;

  // Regla 3: entre 1 y 100 → 400
  @ApiProperty({ example: 78, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  power_level: number;

  // Regla 3: debe ser un CharacterStatus → 400
  @ApiPropertyOptional({ enum: CharacterStatus, default: CharacterStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CharacterStatus)
  status?: CharacterStatus;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_villain?: boolean;

  @ApiPropertyOptional({ example: 1, nullable: true, description: 'null = sin equipo' })
  @IsOptional()
  @IsInt()
  team_id?: number | null;
}