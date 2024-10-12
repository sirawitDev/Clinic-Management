// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css' , '@fortawesome/fontawesome-svg-core/styles.css'],
  ssr: false,
  routeRules: {
    '/': { prerender: true },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@pinia/nuxt', '@nuxtjs/google-fonts'],
  compatibilityDate: '2024-08-19',
  googleFonts: {
    families: {
      Sarabun: [400, 700],
      Inter: [400, 700], 
      Kanit: [400, 700], 
    },
    display: 'swap',
  },
  
});