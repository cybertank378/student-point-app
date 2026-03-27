//Files: src/modules/religion/infrastructure/repository/ReligionRepository.ts

import prisma from "@/libs/prisma";

import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";
import type { ReligionDTO } from "@/modules/religion/domain/dto/ReligionDTO";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";

import { ReligionMapper } from "@/modules/religion/domain/mapper/ReligionMapper";

export class ReligionRepository implements ReligionInterface {

  async findAll(): Promise<ReligionDTO[]> {
    const rows = await prisma.religion.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        kode: true,
        name: true,
      },
    });

    return ReligionMapper.toDTOList(rows);
  }

  async findById(id: string): Promise<ReligionDTO | null> {
    const row = await prisma.religion.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        kode: true,
        name: true,
      },
    });

    if (!row) return null;

    return ReligionMapper.toDTO(row);
  }

  async findByCode(kode: string): Promise<ReligionDTO | null> {
    const row = await prisma.religion.findFirst({
      where: {
        kode,
        deletedAt: null,
      },
      select: {
        id: true,
        kode: true,
        name: true,
      },
    });

    if (!row) return null;

    return ReligionMapper.toDTO(row);
  }

  async create(dto: CreateReligionDTO): Promise<ReligionDTO> {
    const row = await prisma.religion.create({
      data: {
        kode: dto.kode,
        name: dto.name,
      },
      select: {
        id: true,
        kode: true,
        name: true,
      },
    });

    return ReligionMapper.toDTO(row);
  }

  async update(dto: UpdateReligionDTO): Promise<ReligionDTO> {
    const row = await prisma.religion.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
      },
      select: {
        id: true,
        kode: true,
        name: true,
      },
    });

    return ReligionMapper.toDTO(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.religion.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

}