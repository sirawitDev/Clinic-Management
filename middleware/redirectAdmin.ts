// middleware/redirectAdmin.js
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore(); // Assuming you have an auth store

    // Check if the user is authenticated and is an admin
    if (authStore.user && authStore.user.role === 'admin' && to.path !== '/admin') {
        // Redirect the admin to the /admin page
        return navigateTo('/admin');
    }
});
