import { JobScope } from "~/types/enums";
import { EstimateStatus } from "~/types/businessEnums";

export {};

declare global {
    interface Estimate extends EstimateSummary {
        tasks: Partial<JobTask>[];
    }

    interface EstimateSummary {
        id: number;
        date: Date;
        number: number;
        client: string;
        clientId?: number;
        status: EstimateStatus;
        usingValidUntil?: boolean;

        price?: number;
        validUntil?: Date;
        name?: string;
        description?: string;
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