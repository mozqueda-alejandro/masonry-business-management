// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@nuxt/ui-pro"],
  imports: {
    dirs: ['types/*.ts', 'store/*.ts', 'types/**/*.ts'],
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    }
  },
  ssr: false
})
