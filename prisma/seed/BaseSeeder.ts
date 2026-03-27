import type { Seeder } from "./types"

export abstract class BaseSeeder implements Seeder {

    abstract readonly name: string

    protected abstract seed(): Promise<void>

    async execute(): Promise<void> {

        const startedAt = Date.now()

        console.info(`SEED_START  :: ${this.name}`)

        try {

            await this.seed()

            const duration = Date.now() - startedAt

            console.info(
                `SEED_SUCCESS :: ${this.name} (${duration}ms)`
            )

        } catch (error) {

            console.error(
                `SEED_FAILURE :: ${this.name}`
            )

            throw error

        }

    }

}