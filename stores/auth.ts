//store/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref(null);
  const router = useRouter();

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (savedUser && token) {
      isAuthenticated.value = true;
      user.value = JSON.parse(savedUser);
    }
  };

  const login = (userData) => {
    isAuthenticated.value = true;
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
  
    if (userData.user.role === 'admin') {
      router.push('/admin'); 
    } else if (userData.user.role === 'cashier') {
      router.push('/cashier');
    } else {
      router.push('/user'); 
    }
  };
  

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/user');
  };

  const isAdmin = computed(() => user.value?.role === 'admin');

  return {
    isAuthenticated,
    user,
    login,
    logout,
    initializeAuth,
    isAdmin
  };
});
