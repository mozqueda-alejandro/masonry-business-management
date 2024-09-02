
interface NavigationRequests {
    key(): string;
}

export class EstimatesRequests implements NavigationRequests {
    static Estimates: NavigationRequest;
    static NewEstimate: NavigationRequest;
    static NewJobTask: NavigationRequest;
    static key = () => "Estimates";
    static path = () => "/jobs/estimates";

    key() {
        return EstimatesRequests.key();
    }
}

export function initNavigationRequests() {
    initProperties(EstimatesRequests);
}

function initProperties(targetClass: any) {
    const staticProperties = Object.keys(targetClass).filter(
        prop => typeof targetClass[prop] === "undefined" && prop !== 'path' && prop !== 'key'
    );

    const navigationRequests = targetClass as NavigationRequests;
    staticProperties.forEach(property => {
        targetClass[property] = {
            viewName: property,
            pageName: navigationRequests.key()
        };
    });
}

export const initialState: PartialWithUndefined<Installation> = {
    lengthBlocks: undefined,
    lengthFt: undefined,
    heightCourses: undefined,
    topFinish: undefined,
    segments: undefined,
    backPoints: undefined,
    blockWidth: undefined,
    blockType: undefined,
    blockColor: undefined,
    premixColor: undefined,
    specialBlockWidth: undefined,
    specialBlockType: undefined,
    specialBlockColor: undefined,
    specialLengthBlocks: undefined,
    specialLengthFt: undefined,
    specialBlockCourses: undefined,
    footingType: undefined,
    footingWidthFt: undefined,
    footingDepthFt: undefined,
    horizontalInFooting: undefined,
    verticalSpacing: undefined,
    horizontalOnWall: undefined,
    embedmentDepth: undefined,
    existingDowels: undefined
};

export const initialEstimate: Partial<Estimate> = {
    client: undefined,
    name: "Job Estimate",
    status: EstimateStatus.Draft,
    date: new Date(),
    usingValidUntil: true,
    tasks: []
}

import { EstimateStatus } from "~/types/businessEnums";

export const estimateTestData: EstimateSummary[] = [
    { status: EstimateStatus.Approved, date: new Date('2011-10-10'), id: 1, number: 1, client: "John Doe", price: 1000 },
    { status: EstimateStatus.Draft, date: new Date('2012-10-10'), id: 2, number: 2, client: "Jane Doe", price: 2000 },
    { status: EstimateStatus.Saved, date: new Date('2013-10-10'), id: 3, number: 3, client: "John Doe", price: 3000 },
    { status: EstimateStatus.Sent, date: new Date('2014-10-10'), id: 4, number: 4, client: "Jane Doe", price: 4000 },
    { status: EstimateStatus.Viewed, date: new Date('2015-10-10'), id: 5, number: 5, client: "John Doe", price: 5000 }
];