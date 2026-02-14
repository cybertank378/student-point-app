//Files: src/modules/religion/application/services/ReligionService.ts

import type { Result } from "@/modules/shared/core/Result";
import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";

import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";
import { ListReligionUseCase } from "@/modules/religion/application/usecase/ListReligionUseCase";
import { GetReligionByIdUseCase } from "@/modules/religion/application/usecase/GetReligionByIdUseCase";
import { CreateReligionUseCase } from "@/modules/religion/application/usecase/CreateReligionUseCase";
import { UpdateReligionUseCase } from "@/modules/religion/application/usecase/UpdateReligionUseCase";
import { DeleteReligionUseCase } from "@/modules/religion/application/usecase/DeleteReligionUseCase";

export class ReligionService {
  private readonly listUseCase: ListReligionUseCase;
  private readonly getByIdUseCase: GetReligionByIdUseCase;
  private readonly createUseCase: CreateReligionUseCase;
  private readonly updateUseCase: UpdateReligionUseCase;
  private readonly deleteUseCase: DeleteReligionUseCase;

  constructor(repo: ReligionInterface) {
    this.listUseCase = new ListReligionUseCase(repo);
    this.getByIdUseCase = new GetReligionByIdUseCase(repo);
    this.createUseCase = new CreateReligionUseCase(repo);
    this.updateUseCase = new UpdateReligionUseCase(repo);
    this.deleteUseCase = new DeleteReligionUseCase(repo);
  }

  getAll(): Promise<Result<Religion[]>> {
    return this.listUseCase.execute();
  }

  getById(id: string): Promise<Result<Religion>> {
    return this.getByIdUseCase.execute(id);
  }

  create(dto: CreateReligionDTO): Promise<Result<Religion>> {
    return this.createUseCase.execute(dto);
  }

  update(dto: UpdateReligionDTO): Promise<Result<Religion>> {
    return this.updateUseCase.execute(dto);
  }

  delete(id: string): Promise<Result<void>> {
    return this.deleteUseCase.execute(id);
  }
}
