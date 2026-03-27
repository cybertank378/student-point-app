// src/modules/religion/domain/mapper/ReligionMapper.ts

import type { ReligionDTO } from "@/modules/religion/domain/dto/ReligionDTO";

/**
 * Row minimal dari query prisma
 * agar mapper tidak tergantung full prisma type
 */
type ReligionRow = {
  id: string;
  kode: string;
  name: string;
};

export const ReligionMapper = {

  toDTO(row: ReligionRow): ReligionDTO {
    return {
      id: row.id,
      kode: row.kode,
      name: row.name,
    };
  },

  toDTOList(rows: ReligionRow[]): ReligionDTO[] {
    return rows.map((row) => ReligionMapper.toDTO(row));
  },

};