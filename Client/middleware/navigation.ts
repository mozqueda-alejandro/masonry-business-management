export default defineNuxtRouteMiddleware((to, from) => {
    const navigationStore = useNavigationStore();
    const { onRouteChange } = navigationStore;

    onRouteChange(to.path);
})
