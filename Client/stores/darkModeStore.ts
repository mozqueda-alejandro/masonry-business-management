import { defineStore } from "pinia";

export const useDarkModeStore = defineStore("darkMode", () => {
    const colorMode = useColorMode()

    const isDark = computed({
        get () {
            return colorMode.value === "dark"
        },
        set () {
            colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
            document.body.classList.remove("dark-mode");
            document.documentElement.classList.toggle("dark-mode");
        }
    })

    function initTheme() {
        const isDarkPreferred = true; // use local storage to save the theme
        document.documentElement.classList.toggle("dark-mode");
    }

    initTheme()
    return { isDark }
});