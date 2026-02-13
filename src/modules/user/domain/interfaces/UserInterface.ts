//Files: src/modules/user/domain/interfaces/UserInterface.ts

import {User} from "@/modules/user/domain/entity/User";
import {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";
import {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";

export interface UserInterface {
    create(dto: CreateUserDTO): Promise<User>;
    update(dto: UpdateUserDTO): Promise<User>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}