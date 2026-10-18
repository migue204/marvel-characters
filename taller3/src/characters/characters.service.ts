import {BadRequestException, ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Character, CharacterStatus } from './entities/character.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { CreateCharacterDto } from './dto/create-character.dto.js';
import { UpdateCharacterStatusDto } from './dto/update-character-status.dto.js';
import { FilterCharactersDto } from './dto/filter-characters.dto.js';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  // GET /characters?status=&teamId=
  async findAll(filters: FilterCharactersDto) {
    return await this.characterRepository.find({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.teamId && { team_id: filters.teamId }),
      },
      order: { id: 'ASC' },
    });
  }

  // GET /characters/:id (incluye el equipo) — Regla 1: 404
  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }
    return character;
  }

  // POST /characters
  async create(dto: CreateCharacterDto) {
    await this.validateUniqueAlias(dto.alias);
    await this.validateTeam(dto.team_id);

    const character = this.characterRepository.create(dto);
    const saved = await this.characterRepository.save(character);
    return this.findOne(saved.id);
  }

  // PUT /characters/:id (reemplazo completo)
  async update(id: number, dto: CreateCharacterDto) {
    const character = await this.characterRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }
    await this.validateUniqueAlias(dto.alias, id);
    await this.validateTeam(dto.team_id);
    if (dto.status) {
      this.validateStatusChange(character.status, dto.status);
    }

    Object.assign(character, {
      ...dto,
      status: dto.status ?? CharacterStatus.ACTIVE,
      is_villain: dto.is_villain ?? false,
      team_id: dto.team_id ?? null,
    });
    await this.characterRepository.save(character);
    return this.findOne(id);
  }

  // PATCH /characters/:id/status
  async updateStatus(id: number, dto: UpdateCharacterStatusDto) {
    const character = await this.characterRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException(`El personaje con id ${id} no existe`);
    }
    this.validateStatusChange(character.status, dto.status);

    character.status = dto.status;
    await this.characterRepository.save(character);
    return this.findOne(id);
  }

  // DELETE /characters/:id
  async remove(id: number) {
    const character = await this.findOne(id);
    await this.characterRepository.delete(id);
    return character;
  }

  // ---------- Reglas de negocio ----------

  // Regla 2: alias único → 409
  private async validateUniqueAlias(alias: string, excludeId?: number) {
    const existing = await this.characterRepository.findOneBy({
      alias,
      ...(excludeId && { id: Not(excludeId) }),
    });
    if (existing) {
      throw new ConflictException(`Ya existe un personaje con el alias "${alias}"`);
    }
  }

  // Regla 4: el equipo debe existir (404) y estar activo (400)
  private async validateTeam(teamId?: number | null) {
    if (teamId === undefined || teamId === null) return;
    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(`El equipo con id ${teamId} no existe`);
    }
    if (!team.active) {
      throw new BadRequestException(`El equipo "${team.name}" no está activo`);
    }
  }

  // Regla 7: RETIRED no puede pasar directamente a INJURED → 400
  private validateStatusChange(current: CharacterStatus, next: CharacterStatus) {
    if (current === CharacterStatus.RETIRED && next === CharacterStatus.INJURED) {
      throw new BadRequestException(
        'Un personaje RETIRED no puede pasar directamente a INJURED',
      );
    }
  }
}