import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        components: ["Button", "DatePicker"],
        ripple: true,
        theme: {
            options: {
                darkModeSelector: ".my-app-dark"
            },
            preset: Aura
        }
    });
});