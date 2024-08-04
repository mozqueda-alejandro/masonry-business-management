export default defineNuxtRouteMiddleware((to, from) => {
    const globalNavigationStore = useGlobalNavigationStore();
    const { onRouteChange } = globalNavigationStore;

    onRouteChange(to.path);
})
