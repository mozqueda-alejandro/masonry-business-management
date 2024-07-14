// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-07-13",
    components: [
        { path: "~/components/custom", prefix: "Custom" },
        { path: "~/components/estimates", extensions: [".vue"] },
        "~/components"
    ],
    devtools: { enabled: true },
    extends: ["@nuxt/ui-pro"],
    imports: {
        dirs: ["types/*.ts", "store/*.ts", "types/**/*.ts"]
    },
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL
        }
    },
    ssr: false
});