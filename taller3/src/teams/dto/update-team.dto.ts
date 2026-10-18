import { OmitType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto.js';

export class UpdateTeamDto extends OmitType(CreateTeamDto, ['characterIds'] as const) {}