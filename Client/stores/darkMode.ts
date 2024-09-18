import { defineStore } from "pinia";

import colorLib from "@kurkle/color";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement, Chart
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale)
Chart.defaults.font.size = 16;
Chart.defaults.font.family = 'DM Sans';
Chart.defaults.elements.line.fill = true;
Chart.defaults.elements.point.borderWidth = 2;
Chart.defaults.elements.point.radius = 4;

export const useDarkModeStore = defineStore("darkMode", () => {
    const colorMode = useColorMode()

    const isDark = computed({
        get () {
            return colorMode.value === "dark"
        },
        set () {
            const isDark = colorMode.value === "dark";
            if (isDark) {
                colorMode.preference = "light";
                document.body.classList.remove("dark-mode");
                setLightColors();
                console.log("Light mode")
            } else {
                colorMode.preference = "dark";
                document.body.classList.add("dark-mode");
                setDarkColors();
                console.log("Dark mode")
            }

            // colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
            // document.body.classList.remove("dark-mode");
            // document.documentElement.classList.toggle("dark-mode");
        }
    })

    function initTheme() {
        const isDarkPreferred = true; // use local storage to save the theme
        setDarkColors();
        document.documentElement.classList.toggle("dark-mode");
    }

    function convertToTransparent(value: string, opacity: number) {
        let alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return colorLib(value).alpha(alpha).rgbString();
    }

    function setLightColors() {
        Chart.defaults.color = "black";
        Chart.defaults.borderColor = "black";
        Chart.defaults.backgroundColor = convertToTransparent("rgb(0, 0, 0)", 1);
        Chart.defaults.elements.point.backgroundColor = "white";
    }

    function setDarkColors() {
        Chart.defaults.color = "white";
        Chart.defaults.borderColor = "white";
        Chart.defaults.backgroundColor = convertToTransparent("rgb(255, 255, 255)", 1);
        Chart.defaults.elements.point.backgroundColor = "black";
        Chart.defaults.elements.line.borderColor = "white";
        Chart.defaults.elements.line.backgroundColor = "#ffffff";
    }

    initTheme()
    return { isDark }
});