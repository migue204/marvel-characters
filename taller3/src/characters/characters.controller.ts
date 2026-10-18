import {Body, Controller, Delete, Get, Param, ParseIntPipe,Patch, Post, Put, Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterStatusDto } from './dto/update-character-status.dto.js';
import { FilterCharactersDto } from './dto/filter-characters.dto.js';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() filters: FilterCharactersDto) {
    return this.charactersService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCharacterDto) {
    return this.charactersService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCharacterDto) {
    return this.charactersService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterStatusDto,
  ) {
    return this.charactersService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}