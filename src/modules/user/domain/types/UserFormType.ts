//Files: src/modules/user/domain/types/UserFormType.ts

import {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";

export type UserFormType = Omit<UpdateUserDTO, "id">;