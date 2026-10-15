import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersService } from './characters.service.js';
import { Character } from './entities/character.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Character]),
    ],
    controllers: [CharactersController],
    providers: [CharactersService],
})
export class CharactersModule {
}
 