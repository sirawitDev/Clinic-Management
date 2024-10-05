export default defineNuxtRouteMiddleware((to, from) => {
    const token = localStorage.getItem('token');
    if (!token && to.name !== 'login' && to.name !== 'register') {
        return navigateTo('/login');
    }
});
