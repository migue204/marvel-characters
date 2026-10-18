import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Team } from './entities/team.entity.js';
import { Character } from '../characters/entities/character.entity.js';
import { CreateTeamDto } from './dto/create-team.dto.js';
import { UpdateTeamDto } from './dto/update-team.dto.js';
import { AssignCharactersDto } from './dto/assign-characters.dto.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  // GET /teams
  async findAll() {
    return await this.teamRepository.find({ order: { id: 'ASC' } });
  }

  // GET /teams/:id — Regla 1: 404
  async findOne(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) {
      throw new NotFoundException(`El equipo con id ${id} no existe`);
    }
    return team;
  }

  // GET /teams/:id/characters
  async findCharacters(id: number) {
    await this.findOne(id);
    return await this.characterRepository.find({
      where: { team_id: id },
      order: { id: 'ASC' },
    });
  }

  // POST /teams
  async create(dto: CreateTeamDto) {
    const { characterIds, ...teamData } = dto;
    await this.validateUniqueName(teamData.name);

    // Regla 5: validar ANTES de crear, para no dejar un equipo a medias
    if (characterIds?.length) {
      if (teamData.active === false) {
        throw new BadRequestException(
          'No se pueden asignar personajes a un equipo inactivo',
        );
      }
      await this.validateCharactersExist(characterIds);
    }

    const team = await this.teamRepository.save(this.teamRepository.create(teamData));

    if (characterIds?.length) {
      await this.characterRepository.update(
        { id: In(characterIds) },
        { team_id: team.id },
      );
    }
    return this.findOneWithCharacters(team.id);
  }

  // PUT /teams/:id
  async update(id: number, dto: UpdateTeamDto) {
    const team = await this.findOne(id);
    await this.validateUniqueName(dto.name, id);

    Object.assign(team, {
      name: dto.name,
      base: dto.base ?? null,
      founded_year: dto.founded_year ?? null,
      active: dto.active ?? true,
    });
    return await this.teamRepository.save(team);
  }

  // PATCH /teams/:id/characters
  async assignCharacters(id: number, dto: AssignCharactersDto) {
    const team = await this.findOne(id);

    // Regla 5: equipo activo (400) y personajes existentes (404)
    if (!team.active) {
      throw new BadRequestException(`El equipo "${team.name}" no está activo`);
    }
    await this.validateCharactersExist(dto.characterIds);

    await this.characterRepository.update(
      { id: In(dto.characterIds) },
      { team_id: id },
    );
    return this.findOneWithCharacters(id);
  }

  // DELETE /teams/:id
  async remove(id: number) {
    const team = await this.findOne(id);

    // Regla 6: no se elimina si tiene personajes → 409
    const count = await this.characterRepository.countBy({ team_id: id });
    if (count > 0) {
      throw new ConflictException(
        `El equipo "${team.name}" tiene ${count} personaje(s) asociado(s). ` +
          'Desactívalo con PUT (active: false) en lugar de eliminarlo',
      );
    }
    await this.teamRepository.delete(id);
    return team;
  }

  // ---------- Auxiliares y reglas de negocio ----------

  private async findOneWithCharacters(id: number) {
    return await this.teamRepository.findOne({
      where: { id },
      relations: { characters: true },
    });
  }

  // Regla 2: name único → 409
  private async validateUniqueName(name: string, excludeId?: number) {
    const existing = await this.teamRepository.findOneBy({
      name,
      ...(excludeId && { id: Not(excludeId) }),
    });
    if (existing) {
      throw new ConflictException(`Ya existe un equipo con el nombre "${name}"`);
    }
  }

  // Regla 5: todos los personajes deben existir → 404
  private async validateCharactersExist(ids: number[]) {
    const uniqueIds = [...new Set(ids)];
    const found = await this.characterRepository.findBy({ id: In(uniqueIds) });
    if (found.length !== uniqueIds.length) {
      const foundIds = found.map((c) => c.id);
      const missing = uniqueIds.filter((cid) => !foundIds.includes(cid));
      throw new NotFoundException(
        `No existen los personajes con id: ${missing.join(', ')}`,
      );
    }
  }
}