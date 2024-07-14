import { defineStore } from "pinia";
import { LazyEstimates, LazyNewEstimate, LazyNewJobTask } from "#components";
import { NavigationCommand } from "~/types/enums";
import type { Component } from "vue";


interface View {
    component: Component;
    name?: string;
    keepAlive?: boolean;

    get path(): string;
    get defaultComponent(): Component;
    get keepAliveComponents(): string[];
}

class BaseView {
    readonly component: Component;
    readonly name?: string;
    readonly keepAlive?: boolean;

    protected constructor(component: Component, name?: string, keepAlive?: boolean) {
        this.component = component;
        if (name !== undefined && keepAlive !== undefined) {
            this.name = name;
            this.keepAlive = keepAlive;
        }
    }
}

class EstimateView extends BaseView implements View {
    static readonly path = "/jobs/estimates";
    static readonly defaultComponent = LazyEstimates;
    static keepAliveComponents: string[] = [];

    constructor(component: Component);
    constructor(component: Component, name: string);
    constructor(component: Component, name: string, keepAlive: boolean)
    constructor(component: Component, name?: string, keepAlive?: boolean) {
        if (name === undefined) {
            super(component);
            return;
        } else if (keepAlive === undefined) {
            super(component, name, false);
            return;
        }

        super(component, name, keepAlive);
        if (keepAlive) {
            EstimateView.keepAliveComponents.push(name);
        }
    }

    get path() {
        return EstimateView.path;
    }

    get defaultComponent() {
        return EstimateView.defaultComponent;
    }

    get keepAliveComponents() {
        return EstimateView.keepAliveComponents;
    }
}

export const useGlobalNavigationStore = defineStore("globalNavigation", () => {
    const route = useRoute();
    // const currentView = ref<View>();
    // const currentComponent = computed<Component | undefined>(() => currentView.value?.component);
    const currentComponent = shallowRef<Component | null>(null);
    const keepAliveComponents = shallowRef<string[]>([]);

    const viewsMap: Record<NavigationCommand, View> = {
        [NavigationCommand.Estimates]: new EstimateView(LazyEstimates, NavigationCommand.Estimates),
        [NavigationCommand.NewEstimate]: new EstimateView(LazyNewEstimate, NavigationCommand.NewEstimate, true),
        [NavigationCommand.NewJobTask]: new EstimateView(LazyNewJobTask, NavigationCommand.NewJobTask)
    };

    function changeView(command: NavigationCommand) {
        const newView = viewsMap[command];
        navigateTo(newView.path);
        currentComponent.value = newView.component;
        keepAliveComponents.value = newView.keepAliveComponents;
    }

    function resolveDefaultComponent() {
        const view = Object.values(viewsMap).find(view => view.path === route.path);
        if (view) {
            currentComponent.value = view.defaultComponent;
            keepAliveComponents.value = view.keepAliveComponents
        }
    }

    onMounted(() => {
        resolveDefaultComponent();
    });

    return { changeView, currentComponent, keepAliveComponents };
});