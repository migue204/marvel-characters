import { Controller, Get } from '@nestjs/common';
import { CharactersService } from './characters.service.js';

@Controller('characters')
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) {}

    @Get()
    findAll() {
        return this.charactersService.findAll();
    }
}
