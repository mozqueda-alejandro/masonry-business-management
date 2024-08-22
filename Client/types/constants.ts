
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
