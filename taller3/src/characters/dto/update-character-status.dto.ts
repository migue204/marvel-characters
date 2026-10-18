import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../entities/character.entity.js';

export class UpdateCharacterStatusDto {
  @ApiProperty({ enum: CharacterStatus, example: CharacterStatus.INJURED })
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
}