export {};

declare global {
    interface NavigationRequest {
        pageName: string;
        viewName: string;
    }

    interface SelectOption {
        name: string,
        value: any
    }

    type PartialWithUndefined<T> = {
        [P in keyof T]?: T[P] | undefined;
    }

    type PartialWithNull<T> = {
        [P in keyof T]?: T[P] | null
    }
}
