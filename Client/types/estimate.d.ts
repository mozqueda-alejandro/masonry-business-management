import { JobScope } from "~/types/enums";

export {};

declare global {
    interface Estimate {
        id: number;
        name: string;
        description: string;
        number: number;
        date: Date;
        validUntil: Date;
        client: string;
        tasks: Partial<JobTask>[];
    }

    interface JobTaskDetails {
        id: number;
        name: string;
        description: string;
        scope: JobScope;
        price: number;
        modifiedPrice: number;
    }

    type JobTask = Installation | Addition | Repair | Stone | Demo;
}