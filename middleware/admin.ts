export default defineNuxtRouteMiddleware((to, from) => {
    const user = useState('user'); // Assuming you store user data in a state after login

    // If user is not authenticated or role is not 'admin', redirect to home
    if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/')
    }
})
