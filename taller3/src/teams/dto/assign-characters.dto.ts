import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AssignCharactersDto {
  @ApiProperty({ type: [Number], example: [16, 17] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  characterIds: number[];
}