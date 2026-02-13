//Files: src/modules/user/infrastructure/repo/UserRepository.ts
import {User} from "@/modules/user/domain/entity/User";
import {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";
import prisma from "@/libs/prisma";
import {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";
import {UserInterface} from "@/modules/user/domain/interfaces/UserInterface";
import {UserMapper} from "@/modules/user/domain/mapper/UserMapper";

export class UserRepository implements UserInterface {
    async create(dto: CreateUserDTO): Promise<User> {
        const user = await prisma.$transaction(
            async (tx) => {
                const createdUser = await tx.user.create({
                    data: {
                        username: dto.username,
                        password: dto.password,
                        role: dto.role,
                    },
                });

                if (
                    dto.role === "TEACHER" &&
                    dto.teacherRoles &&
                    dto.teacherRoles.length > 0
                ) {
                    await tx.teacher.create({
                        data: {
                            userId: createdUser.id,
                            nip: `TMP-${Date.now()}`, // sementara
                            name: dto.username,
                            roles: dto.teacherRoles,
                        },
                    });
                }

                return createdUser;
            },
        );

        return UserMapper.toDomain(user);
    }

    async update(dto: UpdateUserDTO): Promise<User> {
        const updatedUser = await prisma.$transaction(
            async (tx) => {
                /**
                 * ===============================
                 * UPDATE USER TABLE
                 * ===============================
                 */
                const user = await tx.user.update({
                    where: { id: dto.id },
                    data: {
                        username: dto.username,
                        password: dto.password,
                        role: dto.role,
                        isActive: dto.isActive,
                    },
                });

                /**
                 * ===============================
                 * UPDATE TEACHER ROLE
                 * ===============================
                 */
                if (
                    dto.role === "TEACHER" &&
                    dto.teacherRoles
                ) {
                    await tx.teacher.update({
                        where: { userId: dto.id },
                        data: {
                            roles: dto.teacherRoles,
                        },
                    });
                }

                /**
                 * ===============================
                 * JIKA ROLE DIUBAH BUKAN TEACHER
                 * HAPUS DATA TEACHER
                 * ===============================
                 */
                if (
                    dto.role &&
                    dto.role !== "TEACHER"
                ) {
                    await tx.teacher.deleteMany({
                        where: { userId: dto.id },
                    });
                }

                return user;
            },
        );

        return UserMapper.toDomain(updatedUser);
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    async findById(
        id: string,
    ): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return UserMapper.toDomain(user);
    }

    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();

        return users.map(UserMapper.toDomain);
    }
}