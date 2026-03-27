//Files: prisma/seed/types.ts

export interface SeederContext {
    startedAt: number
}

export interface Seeder {
    name: string
    execute(): Promise<void>
}