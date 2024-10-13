import { defineNuxtPlugin } from 'nuxt/app';
import GoogleSignInPlugin from 'vue3-google-signin';

export default defineNuxtPlugin((nuxtApp) => {
    const clientId = '557530570894-634cp3f1j2epod3e2supi6bhcl3nohj7.apps.googleusercontent.com';

    console.log('Google Client ID:', clientId); // Debugging log

    if (!clientId) {
        console.error('Google Client ID is missing.');
        return;
    }

    nuxtApp.vueApp.use(GoogleSignInPlugin, {
        clientId,
    });
});
