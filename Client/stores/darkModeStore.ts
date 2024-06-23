import { defineStore } from "pinia";
import { ref } from "vue";

export const useDarkModeStore = defineStore("darkMode", () => {
    const colorMode = useColorMode()

    const isDark = computed({
        get () {
            return colorMode.value === 'dark'
        },
        set () {
            colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
            document.body.classList.remove('my-app-dark');
            document.documentElement.classList.toggle("my-app-dark");
        }
    })

    function initTheme() {
        const isDarkPreferred = true; // use local storage to save the theme
        document.documentElement.classList.toggle("my-app-dark");
    }

    initTheme()
    return { isDark }
});