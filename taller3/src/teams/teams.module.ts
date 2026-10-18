import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity.js';
import { Character } from '../characters/entities/character.entity.js';
import { TeamsController } from './teams.controller.js';
import { TeamsService } from './teams.service.js';


@Module({
  imports: [TypeOrmModule.forFeature([Team, Character])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
