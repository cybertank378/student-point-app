//Files: src/modules/shared/core/BaseAppServices.ts
import type { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { Result } from "@/modules/shared/core/Result";

/**
 * ============================================================
 * BASE APPLICATION SERVICE
 * ============================================================
 *
 * Generic service helper used to execute use cases safely.
 */

export abstract class BaseAppServices {
  protected execute<Req, Res>(useCase: BaseUseCase<Req, Res>, request?: Req): Promise<Result<Res>> {
    return useCase.execute(request);
  }
}
