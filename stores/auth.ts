// store/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref({
    id: null,
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    uuid: '',
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
      uuid: userData.user.uuid || '',
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

  const logout = async () => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการออกจากระบบหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      isAuthenticated.value = false;
      user.value = {
        id: null,
        email: '',
        firstname: '',
        lastname: '',
        role: '',
        uuid: '',
        cdnumber: ''
      };
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/user');

      await Swal.fire('ออกจากระบบสำเร็จ', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 'success');
    }
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
