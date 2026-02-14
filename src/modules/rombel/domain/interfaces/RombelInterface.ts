//Files: src/modules/rombel/domain/interfaces/RombelInterface.ts

import type {Rombel} from "@/modules/rombel/domain/entity/Rombel";
import type {CreateRombelDTO} from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type {UpdateRombelDTO} from "@/modules/rombel/domain/dto/UpdateRombelDTO";

export interface RombelInterface {
    findAll(): Promise<Rombel[]>;
    findById(id: string): Promise<Rombel | null>;

    create(dto: CreateRombelDTO): Promise<Rombel>;
    update(dto: UpdateRombelDTO): Promise<Rombel>;

    delete(id: string): Promise<void>;

    hasStudents(id: string): Promise<boolean>;

    findByLabel(label: string): Promise<Rombel | null>;
}