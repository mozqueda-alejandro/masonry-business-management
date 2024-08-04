
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
