export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    authStore.initializeAuth();

    // Check if the route requires admin access
    if (to.path.startsWith('/admin') && !authStore.isAdmin) {
        return navigateTo('/user'); // Redirect to /user if not admin
    }
});
