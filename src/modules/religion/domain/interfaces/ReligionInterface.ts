//Files: src/modules/religion/domain/interfaces/ReligionInterface.ts

import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";

export interface ReligionInterface {
  findAll(): Promise<Religion[]>;
  findById(id: string): Promise<Religion | null>;
  findByCode(kode: string): Promise<Religion | null>;
  create(dto: CreateReligionDTO): Promise<Religion>;
  update(dto: UpdateReligionDTO): Promise<Religion>;
  delete(id: string): Promise<void>;
}
