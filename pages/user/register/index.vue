<template>
  <div class="flex items-center justify-center min-h-screen">
    <form @submit.prevent="register" class="card w-full max-w-sm bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">สมัครสมาชิก</h2>

        <div class="form-control">
          <label class="label">อีเมล</label>
          <input v-model="email" type="email" placeholder="Enter email" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">รหัสผ่าน</label>
          <input v-model="password" type="password" placeholder="Enter password" class="input input-bordered" />
        </div>

        <div class="form-control mt-4">
          <button type="submit" class="btn btn-primary">Register</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  const response = await $fetch('/api/auth/register', {
    method: 'POST',
    body: { email: email.value, password: password.value }
  });

  if (response.success) {
    router.push('/user/login');
  }
};
</script>
