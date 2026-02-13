//Files: src/modules/religion/domain/entity/Religion.ts

export class Religion {
    constructor(
        public readonly id: string,
        public readonly kode: string,
        public name: string,
    ) {}
}
