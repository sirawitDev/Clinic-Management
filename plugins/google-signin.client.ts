import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import GoogleSignInPlugin from 'vue3-google-signin';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const clientId = config.public.googleClientId;

    nuxtApp.vueApp.use(GoogleSignInPlugin, {
        clientId, // Your Google Client ID
    });
});
