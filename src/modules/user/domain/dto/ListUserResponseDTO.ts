// Path: src/modules/user/domain/dto/ListUserResponseDTO.ts

import {UserEntity} from "@/modules/user/domain/entity/UserEntity";

export interface ListUserResponseDTO{
    readonly data: ReadonlyArray<UserEntity>;
    readonly total: number;
    readonly page: number;
    readonly limit: number;
}