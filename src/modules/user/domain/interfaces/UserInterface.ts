//Files: src/modules/user/domain/interfaces/UserInterface.ts

import type {User} from "@/modules/user/domain/entity/User";
import type {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";
import type {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";

export interface UserInterface {
    create(dto: CreateUserDTO): Promise<User>;
    update(dto: UpdateUserDTO): Promise<User>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}