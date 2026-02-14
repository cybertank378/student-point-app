//Files: src/modules/achievement/application/services/AchievementService.ts

import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";

import { ListAchievementUseCase } from "@/modules/achievement/application/usecases/ListAchievementUseCase";
import { GetAchievementByIdUseCase } from "@/modules/achievement/application/usecases/GetAchievementByIdUseCase";
import { CreateAchievementUseCase } from "@/modules/achievement/application/usecases/CreateAchievementUseCase";
import { UpdateAchievementUseCase } from "@/modules/achievement/application/usecases/UpdateAchievementUseCase";
import { DeleteAchievementUseCase } from "@/modules/achievement/application/usecases/DeleteAchievementUseCase";

import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type { Result } from "@/modules/shared/core/Result";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

/**
 * Application Service
 * ===================
 * - Mengorkestrasi usecases
 * - Tidak punya logic bisnis
 * - Tidak tahu HTTP / Prisma
 */
export class AchievementService {
  private readonly listUseCase: ListAchievementUseCase;
  private readonly getByIdUseCase: GetAchievementByIdUseCase;
  private readonly createUseCase: CreateAchievementUseCase;
  private readonly updateUseCase: UpdateAchievementUseCase;
  private readonly deleteUseCase: DeleteAchievementUseCase;

  constructor(repo: AchievementInterface) {
    this.listUseCase = new ListAchievementUseCase(repo);
    this.getByIdUseCase = new GetAchievementByIdUseCase(repo);
    this.createUseCase = new CreateAchievementUseCase(repo);
    this.updateUseCase = new UpdateAchievementUseCase(repo);
    this.deleteUseCase = new DeleteAchievementUseCase(repo);
  }

  /**
   * =====================
   * LIST
   * =====================
   */
  list(): Promise<Result<Achievement[]>> {
    return this.listUseCase.execute();
  }

  /**
   * =====================
   * GET BY ID
   * =====================
   */
  getById(id: string): Promise<Result<Achievement>> {
    return this.getByIdUseCase.execute(id);
  }

  /**
   * =====================
   * CREATE
   * =====================
   */
  create(dto: CreateAchievementDTO): Promise<Result<Achievement>> {
    return this.createUseCase.execute(dto);
  }

  /**
   * =====================
   * UPDATE
   * =====================
   */
  update(dto: UpdateAchievementDTO): Promise<Result<Achievement>> {
    return this.updateUseCase.execute(dto);
  }

  /**
   * =====================
   * DELETE (SOFT)
   * =====================
   */
  delete(id: string): Promise<Result<void>> {
    return this.deleteUseCase.execute(id);
  }
}
