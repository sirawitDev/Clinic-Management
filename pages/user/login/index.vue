<template>
  <div class="flex items-center justify-center">
    <form @submit.prevent="login" class="card w-full max-w-sm bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title"></h2>

        <div class="form-control">
          <label class="label">Email</label>
          <input v-model="email" type="email" placeholder="Enter email" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">Password</label>
          <input v-model="password" type="password" placeholder="Enter password" class="input input-bordered" />
        </div>

        <div class="form-control mt-4">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>

        <div>
          <RouterLink to="/user/register" class="btn btn-accent text-white font-light w-full">Register</RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth'; // นำเข้า authStore

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore(); // เรียกใช้ authStore

const login = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });

    if (response.success) {
      // เก็บ token และข้อมูลผู้ใช้ใน authStore
      authStore.login({ token: response.token, user: response.user });
      alert('Login success');
      router.push('/user');
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    alert('Login failed');
  }
};
</script>
