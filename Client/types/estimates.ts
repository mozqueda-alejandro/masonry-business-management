import { JobScope } from "~/types/enums";

export class JobTask {
    id: number;
    name: string;
    description: string;
    jobScope: JobScope;
    price: number;

    protected constructor(id: number, name: string, description: string, jobScope: JobScope, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.jobScope = jobScope;
        this.price = price;
    }
}

export class Installation extends JobTask {
    wallSpecs?: WallSpecs;
    blockSpecs?: BlockSpecs;
    specialBlockSpecs?: SpecialBlockSpecs;
    rebarSpecs?: RebarSpecs;

    // constructor(id: number, name: string, description: string, jobScope: JobScope, cost: number, wallSpecs: WallSpecs, blockSpecs: BlockSpecs, specialBlockSpecs: SpecialBlockSpecs, rebarSpecs: RebarSpecs) {
    //     super(id, name, description, jobScope, cost);
    //     this.wallSpecs = wallSpecs;
    //     this.blockSpecs = blockSpecs;
    //     this.specialBlockSpecs = specialBlockSpecs;
    //     this.rebarSpecs = rebarSpecs;
    // }
}

export class Addition extends JobTask {
    wallSpecs?: WallSpecs;
    blockSpecs?: BlockSpecs;
    specialBlockSpecs?: SpecialBlockSpecs;
    rebarSpecs?: RebarSpecs;

}