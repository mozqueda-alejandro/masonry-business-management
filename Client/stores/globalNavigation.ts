import { defineStore } from "pinia";
import { Estimates, NewEstimate, NewJobTask } from "#components";
import { initNavigationRequests, EstimatesRequests } from "~/types/constants";


import type { Component } from "vue";


type ViewMap = Map<string, View>;

interface View {
    component: Component;
    name: string;
    keepAlive: boolean;
}

interface Page {
    key: string;
    path: string;
    defaultView: View;
    views: ViewMap;
    readonly keepAliveComponents: string[];

    getComponent(name: string): Component;
}

class ViewImpl implements View {
    component: Component;
    name: string;
    keepAlive: boolean;

    constructor(component: Component, name: string, keepAlive: boolean = false) {
        this.component = component;
        this.name = name;
        this.keepAlive = keepAlive;
    }
}

class PageImpl implements Page {
    key: string;
    path: string;
    defaultView: View;
    views: ViewMap;
    readonly keepAliveComponents: string[] = [];

    constructor(key: string, path: string, defaultView: View, views: ViewMap) {
        this.key = key;
        this.path = path;
        this.defaultView = defaultView;
        this.views = views;

        for (const view of views.values()) {
            if (view.keepAlive) {
                this.keepAliveComponents.push(view.name);
            }
        }
    }

    getComponent(viewName: string): Component {
        return this.views.get(viewName)?.component || this.defaultView.component;
    }
}

class PageBuilder {
    private key: string = "";
    private path: string = "";
    private defaultView: View | null = null;
    private views: ViewMap = new Map();

    setPageInfo(key: string, path: string): this {
        this.key = key;
        this.path = path;
        return this;
    }

    setDefaultComponent(defaultComponent: View): this {
        this.defaultView = defaultComponent;
        return this;
    }

    addComponent(view: View): this {
        this.views.set(view.name, view);
        return this;
    }

    build(): Page {
        if (!this.key || !this.path) throw new Error("Key and path must be set");
        if (!this.defaultView) throw new Error("Default component must be set");

        return new PageImpl(this.key, this.path, this.defaultView, this.views);
    }
}

export const useGlobalNavigationStore = defineStore("globalNavigation", () => {
    const route = useRoute();
    const currentComponent = shallowRef<Component | null>(null);
    const keepAliveComponents = ref<string[]>([]);
    const pages = ref<Page[]>([]);

    function initPages() {
        pages.value = [
            new PageBuilder()
                .setPageInfo(EstimatesRequests.key(), EstimatesRequests.path())
                .setDefaultComponent(new ViewImpl(Estimates, EstimatesRequests.Estimates.viewName))
                .addComponent(new ViewImpl(NewEstimate, EstimatesRequests.NewEstimate.viewName, true))
                .addComponent(new ViewImpl(NewJobTask, EstimatesRequests.NewJobTask.viewName))
                .build()
        ];

        return pages;
    }

    function changeView(request: NavigationRequest) {
        console.log("Request- ", request);
        const page = pages.value.find(p => p.key === request.pageName);
        if (!page) throw new Error(`Page not found: ${ request }`);

        currentComponent.value = page.getComponent(request.viewName);
        keepAliveComponents.value = page.keepAliveComponents;
    }

    function onRouteChange(newPath: string) {
        const page = pages.value.find(p => p.path === newPath);
        if (!page) {
            currentComponent.value = null;
            keepAliveComponents.value = [];
            return;
        }

        currentComponent.value = page.defaultView.component;
        keepAliveComponents.value = page.keepAliveComponents;
    }

    function init() {
        initNavigationRequests();
        initPages();
        onRouteChange(route.path);
    }

    init();

    return { currentComponent, keepAliveComponents, pages, changeView, onRouteChange };
});