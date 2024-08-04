
export function useNavigation() {
    const navigationStore = useGlobalNavigationStore();
    const { currentComponent, keepAliveComponents } = storeToRefs(navigationStore);
    const { changeView } = navigationStore;

    return {
        currentComponent,
        keepAliveComponents,
        changeView
    };
}