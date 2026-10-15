import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity.js';
import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private readonly characterRepository: Repository<Character>,
    ) {}
    async findAll() {
        return await this.characterRepository.find();
    }
}
