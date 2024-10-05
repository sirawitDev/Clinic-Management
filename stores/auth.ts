import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref(null);
  const router = useRouter();

  // Load token from local storage on page load
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
    // Save the user data and token in local storage
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/user');
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    initializeAuth,
  };
});
