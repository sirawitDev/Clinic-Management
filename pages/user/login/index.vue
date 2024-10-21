<template>
  <div class="flex items-center justify-center mt-10">
    <form @submit.prevent="login" class="card w-full max-w-sm bg-base-100 shadow-md">
      <div class="card-body">
        <img src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png" alt="logo" class=" w-72">

        <div class="divider"></div>

        <div class="flex gap-1 w-full mx-auto justify-center">
          <button type="button" @click="showLoginForm"
            class="link link-accent font-light w-52 text-orange-400 text-lg rounded-xl">เข้าสู่ระบบ</button>
          <div class="divider lg:divider-horizontal"></div>
          <button type="button" @click="showRegisterForm"
            class="link link-accent w-52 font-light text-orange-400 text-md rounded-xl">สมัครสมาชิก</button>
        </div>

        <div v-if="isLoginForm" class="mt-4">
          <form @submit.prevent="login">
            <div class="form-control">
              <label>อีเมล</label>
              <input v-model="email" type="email" placeholder="" class="input input-bordered" />
            </div>
            <div class="form-control mt-5">
              <label>รหัสผ่าน</label>
              <input v-model="password" type="password" placeholder="" class="input input-bordered" />
              <p v-if="loginError" class="text-red-500 mt-1">{{ loginError }}</p>
            </div>
            <div class="form-control mt-5">
              <button type="submit" class="btn btn-accent text-white font-light">เข้าสู่ระบบ</button>
            </div>

            <div class="divider"></div>

            <div class="flex justify-center mt-5">
              <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
            </div>
          </form>
        </div>

        <div v-else class="mt-4">
          <form @submit.prevent="register">
            <div class="form-control">
              <label class="text-lg mx-1">อีเมล</label>
              <input v-model="registerEmail" type="email" placeholder="" class="input input-bordered" />
              <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
            </div>

            <div class="form-control mt-5">
              <label class="text-lg mx-1">รหัสผ่าน</label>
              <input v-model="registerPassword" type="password" placeholder="" class="input input-bordered" />
            </div>

            <div class="form-control mt-5">
              <label class="text-lg mx-1">รหัสผ่านอีกครั้ง</label>
              <input v-model="confirmPassword" type="password" placeholder="" class="input input-bordered" />
            </div>
            <div class="form-control mt-5">
              <button type="submit" class="btn btn-accent text-white font-light">สร้างบัญชี</button>
            </div>
          </form>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

const email = ref('');
const password = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const confirmPassword = ref('');
const emailError = ref('');

const loginError = ref('')

const router = useRouter();
const authStore = useAuthStore();
const isLoginForm = ref(true);

const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  let user;
  if (credential) {
    user = await $fetch("/api/auth/google-login", {
      method: "POST",
      body: {
        token: credential,
      },
    })
    authStore.login(user);
  }

};

const handleLoginError = () => {
  console.error("Google login failed");
  alert('Google login failed');
};

const register = async () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(hotmail\.com|gmail\.com)$/;

  if (!emailRegex.test(registerEmail.value)) {
    emailError.value = 'กรุณาใช้อีเมล @hotmail.com หรือ @gmail.com เท่านั้น';
    return;
  }

  if (registerPassword.value !== confirmPassword.value) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: registerEmail.value,
        password: registerPassword.value,
        confirmPassword: confirmPassword.value,
      },
    });
    window.location.reload()
  } catch (error) {
    console.error('Registration failed', error);
  }
};

const login = async () => {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    authStore.login(response);
  } catch (error) {
    console.error('Login failed', error);
    loginError.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  }
};
const showLoginForm = () => {
  isLoginForm.value = true;
  registerEmail.value = '';
  registerPassword.value = '';
  confirmPassword.value = '';
};

const showRegisterForm = () => {
  isLoginForm.value = false;
  email.value = '';
  password.value = '';
  loginError.value = '';
};

authStore.initializeAuth(); // Initialize authentication
</script>
