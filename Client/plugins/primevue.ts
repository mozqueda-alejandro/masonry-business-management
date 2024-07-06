import PrimeVue from "primevue/config";
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        components: ["Button", "DataTable", "DatePicker"],
        ripple: true,
        theme: {
            options: {
                darkModeSelector: ".dark-mode"
            },
            preset: Noir
        }
    });
});

const CustomPreset = definePreset(Aura, {
    semantic: {
        primary: {
            '50': '#fef2f2',
            '100': '#fee2e2',
            '200': '#fecaca',
            '300': '#fca5a5',
            '400': '#f87171',
            '500': '#ee3f3f',
            '600': '#db2727',
            '700': '#b91c1c',
            '800': '#991b1b',
            '900': '#7f1d1d',
            '950': '#450a0a'
        }
    }
});

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{zinc.50}",
            100: "{zinc.100}",
            200: "{zinc.200}",
            300: "{zinc.300}",
            400: "{zinc.400}",
            500: "{zinc.500}",
            600: "{zinc.600}",
            700: "{zinc.700}",
            800: "{zinc.800}",
            900: "{zinc.900}",
            950: "{zinc.950}"
        },
        colorScheme: {
            light: {
                primary: {
                    color: "{zinc.950}",
                    inverseColor: "#ffffff",
                    hoverColor: "{zinc.900}",
                    activeColor: "{zinc.800}"
                },
                highlight: {
                    background: "{zinc.950}",
                    focusBackground: "{zinc.700}",
                    color: "#ffffff",
                    focusColor: "#ffffff"
                }
            },
            dark: {
                primary: {
                    color: "{zinc.50}",
                    inverseColor: "{zinc.950}",
                    hoverColor: "{zinc.100}",
                    activeColor: "{zinc.200}"
                },
                highlight: {
                    background: "rgba(250, 250, 250, .16)",
                    focusBackground: "rgba(250, 250, 250, .24)",
                    color: "rgba(255,255,255,.87)",
                    focusColor: "rgba(255,255,255,.87)"
                }
            }
        }
    }
});