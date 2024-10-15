// store/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref({
    id: null,
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    cdnumber: ''
  });

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
    user.value = {
      id: userData.user.id,
      email: userData.user.email,
      firstname: userData.user.firstname,
      lastname: userData.user.lastname,
      role: userData.user.role,
      cdnumber: userData.user.cdnumber || ' '
    };
    localStorage.setItem('user', JSON.stringify(user.value));
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
    user.value = {
      id: null,
      email: '',
      firstname: '',
      lastname: '',
      role: '',
      cdnumber: ''
    };
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/user');
  };

  const isAdmin = computed(() => user.value?.role === 'admin');

  const updateUserName = (firstname, lastname) => {
    user.value.firstname = firstname;
    user.value.lastname = lastname;
    localStorage.setItem('user', JSON.stringify(user.value)); // Save updated user to localStorage
  };

  const updateCdnumber = (cdnumber) => {
    user.value.cdnumber = cdnumber;
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    initializeAuth,
    isAdmin,
    updateUserName,
    updateCdnumber
  };
});
