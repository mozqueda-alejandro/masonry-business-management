import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                customPrimary: {
                    50: "#E9A2A6",
                    100: "#E59296",
                    200: "#DD7177",
                    300: "#D55057",
                    400: "#CB3139",
                    500: "#AA2930",
                    600: "#7D1E23",
                    700: "#501316",
                    800: "#22080A",
                    900: "#000000",
                    950: "#000000"
                },
                customNeutral: {
                    50: "#fafafa",
                    100: "#f4f4f5",
                    200: "#e4e4e7",
                    300: "#d4d4d8",
                    400: "#a1a1aa",
                    500: "#71717a",
                    600: "#52525b",
                    700: "#3f3f46",
                    800: "#27272a",
                    900: "#18181b",
                    950: "#09090b"
                },
                customNeutral21: {
                    50: "#fafafa",
                    100: "#f4f4f5",
                    200: "#e4e4e7",
                    300: "#d4d4d8",
                    400: "#a1a1aa",
                    500: "#606069",
                    600: "#45454d",
                    700: "#323238",
                    800: "#202023",
                    900: "#111113",
                    950: "#09090b"
                },
                customNeutral2: {
                    50: "#fafafa",
                    100: "#f4f4f5",
                    200: "#e4e4e7",
                    300: "#d4d4d8",
                    400: "#a1a1aa",
                    500: "#606069",
                    600: "#45454d",
                    700: "#323238",
                    800: "#202023",
                    900: "#09090b",// "#111113",
                    950: "#09090b"
                }
            }
            // ,
            // transitionProperty: {
            //     'color': 'height',
            //     'background-color': 'margin, padding',
            // }
        }
    }
};
