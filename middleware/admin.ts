export default defineNuxtRouteMiddleware((to, from) => {
    const user = useState('user');

    if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/')
    }
})
