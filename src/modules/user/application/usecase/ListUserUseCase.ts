
import { Result } from "@/modules/shared/core/Result";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { ListUserResponseDTO } from "@/modules/user/domain/dto/ListUserResponseDTO";

interface ListUserRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export class ListUserUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(
        request: ListUserRequest
    ): Promise<Result<ListUserResponseDTO>> {
        try {
            /**
             * ===============================
             * SANITIZE INPUT
             * ===============================
             */
            const page = request.page && request.page > 0 ? request.page : 1;
            const limit =
                request.limit && request.limit > 0
                    ? Math.min(request.limit, 100)
                    : 10;

            const search = request.search?.trim();

            /**
             * ===============================
             * FETCH DATA
             * ===============================
             */
            const { data, total } = await this.repo.list({
                page,
                limit,
                search,
            });

            return Result.ok({
                data,
                total,
                page,
                limit,
            });
        } catch (error) {
            return Result.fail("Gagal mengambil daftar user.");
        }
    }
}
