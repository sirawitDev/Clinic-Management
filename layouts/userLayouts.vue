<template>
  <div class="container mx-auto">

    <div
      class="navbar bg-base-100 mb-5 bg-[#FAFAFA] rounded-full mx-1 my-3 shadow-lg sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div class="flex-1 mx-3 hidden sm:block">
        <RouterLink to="/user" class="flex-1 flex items-center">
          <img class="w-[130px] h-12 mx-2" src="https://img2.pic.in.th/pic/-removebg-preview344b007cb6dec167.png"
            alt="logo">
        </RouterLink>
      </div>

      <div class=" menu hidden sm:block">
        <ul class="flex items-center">
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user">หน้าแรก</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/promotion">โปรโมชั่น</RouterLink>
          </li>
          <!-- <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/course">คอร์ส</RouterLink>
          </li> -->
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/product">สินค้า</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/about">เกี่ยวกับเรา</RouterLink>
          </li>
        </ul>
      </div>

      <div class="flex-none gap-5 sm:flex">

        <button class="sm:hidden btn btn-ghost btn-circle mx-1" @click="toggleMobileNav">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Sidebar for Mobile Navigation -->
        <div v-if="mobileNavOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
          @click="toggleMobileNav">
          <div class="absolute left-0 top-0 h-full w-60 bg-white font-kanit" @click.stop>
            <h2 class="text-5xl text-white font-bold mb-4 text-center mt-5 text-stroke">MENU</h2>
            <div class="divider pr-4 pl-4"></div>
            <ul class="flex flex-col">
              <li class="">
                <RouterLink to="/user" class="block py-2 px-4 hover:bg-gray-200 rounded-full" @click="toggleMobileNav">
                  หน้าแรก
                </RouterLink>
              </li>
              <li class="mt-2">
                <RouterLink to="/user/promotion" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                  @click="toggleMobileNav">
                  โปรโมชั่น</RouterLink>
              </li>
              <li class="mt-2">
                <RouterLink to="/user/product" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                  @click="toggleMobileNav">สินค้า
                </RouterLink>
              </li>
              <li class="mt-2">
                <RouterLink to="/user/about" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                  @click="toggleMobileNav">
                  เกี่ยวกับเรา</RouterLink>
              </li>
            </ul>
          </div>
        </div>


        <form class="relative mx-auto hidden sm:block" @submit.prevent="handleSearch">
          <input type="search"
            class="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-orange-300 focus:pl-16 focus:pr-4"
            v-model="searchText" placeholder="ค้นหาสินค้า..." />
          <svg xmlns="http://www.w3.org/2000/svg"
            class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-orange-300 peer-focus:stroke-orange-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <div class="hidden sm:block">
          <div v-if="authStore.isAuthenticated">
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img alt="User Avatar"
                    :src="authStore.user?.role === 'admin' ? 'https://img5.pic.in.th/file/secure-sv1/software-engineerc1438b6fade78e82.png' : 'https://img2.pic.in.th/pic/volunteer_11077481.png'" />
                </div>
              </div>
              <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <RouterLink to="/user/profile">โปรไฟล์</RouterLink>
                </li>
                <li><a @click="authStore.logout()">ออกจากระบบ</a></li>

                <li v-if="authStore.user?.role === 'admin'">
                  <RouterLink to="/admin/" class="text-red-500">ไปหน้าแอดมิน</RouterLink>
                  <RouterLink to="/Cashier" class="text-orange-400">ไปหน้าแคชเชียร์</RouterLink>
                </li>

              </ul>
            </div>
          </div>
          <div v-else class="mr-5 sm:ml-auto">
            <button class="btn btn-accent font-light text-white" onclick="my_modal_3.showModal()">เข้าสู่ระบบ</button>
            <dialog id="my_modal_3" class="modal">
              <div class="modal-box">
                <form method="dialog">
                  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <div class="flex justify-center w-full">
                  <!-- <h3 class="text-5xl text-white font-bold text-center text-stroke font-kanit">แอร์พอร์ต เมดิคอล คลินิก</h3> -->
                  <img src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png" alt="logo"
                    class=" w-72">
                </div>

                <div class="divider"></div>

                <div class="flex gap-1 w-full mx-auto justify-center">
                  <button @click="showLoginForm"
                    class="link link-accent font-light w-52 text-orange-400 text-lg rounded-xl">เข้าสู่ระบบ</button>
                  <div class="divider lg:divider-horizontal"></div>
                  <button @click="showRegisterForm"
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
              <div v-if="showSuccessMessageRegister" role="alert"
                class="alert alert-success absolute bottom-5 right-10 w-60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current text-white" fill="none"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-white">สมัครสมาชิกเสร็จสิ้น</span>
              </div>
              <div v-if="showSuccessMessageLogin" role="alert"
                class="alert alert-success absolute bottom-5 right-10 w-60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current text-white" fill="none"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-white">ล็อคอินสำเร็จ</span>
              </div>
            </dialog>
          </div>
        </div>

      </div>

    </div>
    <div class="absolute top-8 right-8 sm:hidden">
      <div v-if="!authStore.isAuthenticated">
        <RouterLink to="/user/login">
          <font-awesome-icon :icon="['fas', 'user']" class="text-2xl text-orange-400" />
        </RouterLink>
      </div>
      <div v-if="authStore.isAuthenticated">
        <div class="dropdown dropdown-end -my-3 -mx-4">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="User Avatar"
                :src="authStore.user?.role === 'admin' ? 'https://img5.pic.in.th/file/secure-sv1/software-engineerc1438b6fade78e82.png' : 'https://img2.pic.in.th/pic/volunteer_11077481.png'" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <RouterLink to="/user/profile">โปรไฟล์</RouterLink>
            </li>
            <li><a @click="authStore.logout()">ออกจากระบบ</a></li>

            <li v-if="authStore.user?.role === 'admin'">
              <RouterLink to="/admin/" class="text-red-500">ไปหน้าแอดมิน</RouterLink>
              <RouterLink to="/Cashier" class="text-orange-400">ไปหน้าแคชเชียร์</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>


    <slot></slot>

    <div class="hero mt-5 rounded-lg mb-5 font-kanit" style="
        background-image: url(https://img.freepik.com/free-photo/blurred-common-room_1203-106.jpg);
        ">
      <div class="  rounded-lg"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md rounded-md p-4">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">ติดต่อเรา</h2>
          <div class="flex bg-base-100 sm:w-96 w-72 h-16 rounded-full mt-2 gap-2 p-1 shadow-xl">
            <div class="flex justify-center w-full gap-5 mt-1">
              <Facebook />

              <button onclick="my_modal_6.showModal()">
                <Tel />
              </button>
              <dialog id="my_modal_6" class="modal">
                <div class="modal-box">
                  <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 class="text-lg font-bold text-black font-light">เบอร์โทรศัพท์</h3>
                  <p class="py-4 text-accent text-2xl">080-000-0000</p>
                </div>
              </dialog>
              <Line />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '~/middleware/auth';
import { useAuthStore } from '~/stores/auth.ts';
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

import Facebook from '~/components/user/Facebook.vue';
import Line from '~/components/user/Line.vue';
import Tel from '~/components/user/Tel.vue';

const mobileNavOpen = ref(false);

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

const emailError = ref('');

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
    showSuccessMessageLogin.value = true;
  }

  console.log('user : ', user)
};

const handleLoginError = () => {
  console.error("Login failed");
};

const authStore = useAuthStore();
const router = useRouter();
const searchText = ref('');
const isLoginForm = ref(true);
const showSuccessMessageLogin = ref(false);
const showSuccessMessageRegister = ref(false);

const email = ref('');
const password = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const confirmPassword = ref('');
const loginError = ref('')

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

    showSuccessMessageRegister.value = true;
    setTimeout(() => {
      showSuccessMessageRegister.value = false;
      window.location.reload()
    }, 3000);
    console.log('User registered successfully', response);
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
    showSuccessMessageLogin.value = true;
    setTimeout(() => {
      showSuccessMessageLogin.value = false;
    }, 3000);
  } catch (error) {
    console.error('Login failed', error);
    loginError.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  }
};


const showLoginForm = () => {
  isLoginForm.value = true; // แสดงแบบฟอร์มเข้าสู่ระบบ
};

const showRegisterForm = () => {
  isLoginForm.value = false; // แสดงแบบฟอร์มสมัครสมาชิก
};

const handleSearch = () => {
  // Redirect to the search page with the search query
  router.push({ path: '/user/search', query: { q: searchText.value } });
};

authStore.initializeAuth()

definePageMeta({
  middleware: ['redirectAdmin']
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
