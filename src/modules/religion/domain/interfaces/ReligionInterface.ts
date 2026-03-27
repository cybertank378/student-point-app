//Files: src/modules/religion/domain/interfaces/ReligionInterface.ts

import type { ReligionDTO } from "@/modules/religion/domain/dto/ReligionDTO";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";

export interface ReligionInterface {
  findAll(): Promise<ReligionDTO[]>;
  findById(id: string): Promise<ReligionDTO | null>;
  findByCode(kode: string): Promise<ReligionDTO | null>;
  create(dto: CreateReligionDTO): Promise<ReligionDTO>;
  update(dto: UpdateReligionDTO): Promise<ReligionDTO>;
  delete(id: string): Promise<void>;
}
