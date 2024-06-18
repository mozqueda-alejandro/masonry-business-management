import { defineStore } from "pinia";
import { ref } from "vue";

export const useDarkModeStore = defineStore("darkMode", () => {
    const isDarkPreferred = true; // use local storage to save the theme
    document.body.classList.toggle("my-app-dark");

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
    document.body.classList.toggle("my-app-dark");

    function toggleTheme() {
        isDark.value = !isDark.value;
    }

    return { isDark, toggleTheme }
});