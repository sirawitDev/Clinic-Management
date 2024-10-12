<template>
  <div class="container mx-auto">
    <div
      class="navbar bg-base-100 mb-5 bg-[#FAFAFA] rounded-full my-3 shadow-lg sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div class="flex-1 mx-3">
        <RouterLink to="/user" class="flex-1 flex items-center">
          <img class="w-[130px] h-12 mx-2" src="https://img2.pic.in.th/pic/-removebg-preview344b007cb6dec167.png"
            alt="logo">
        </RouterLink>
      </div>

      <div class="mx-5 menu">
        <ul class="flex items-center">
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user">หน้าแรก</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/promotion">โปรโมชั่น</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/course">คอร์ส</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/product">สินค้า</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/user/about">เกี่ยวกับเรา</RouterLink>
          </li>
        </ul>
      </div>

      <div class="flex-none gap-3">
        <form class="relative mx-auto w-max" @submit.prevent="handleSearch">
          <input type="search"
            class="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-orange-300 focus:pl-16 focus:pr-4"
            v-model="searchText" @keyup="handleSearch" />
          <svg xmlns="http://www.w3.org/2000/svg"
            class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-orange-300 peer-focus:stroke-orange-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <div v-if="authStore.isAuthenticated">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img alt="User Avatar" src="https://img2.pic.in.th/pic/volunteer_11077481.png" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <RouterLink to="/user/profile">โปรไฟล์</RouterLink>
              </li>
              <li><a @click="authStore.logout()">ออกจากระบบ</a></li>
            </ul>
          </div>
        </div>

        <div v-else class="mr-5">
          <button class="btn btn-accent font-light text-white" onclick="my_modal_3.showModal()">เข้าสู่ระบบ</button>
          <dialog id="my_modal_3" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>

              <div class="flex justify-center w-full">
                <!-- <h3 class="text-5xl text-white font-bold text-center text-stroke font-kanit">แอร์พอร์ต เมดิคอล คลินิก</h3> -->
                <img src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png" alt="logo" class=" w-72">
              </div>

              <div class="divider"></div>

              <div class="flex gap-1 w-full mx-auto justify-center">
                <button @click="toggleForm" class="btn btn-link text-[#FF8128] text-lg">เข้าสู่ระบบ</button>
                <button @click="toggleForm" class="btn btn-link text-[#FF8128] text-lg">สมัครสมาชิก</button>
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
                  </div>
                  <div class="form-control mt-5">
                    <button type="submit" class="btn btn-primary">เข้าสู่ระบบ</button>
                  </div>
                </form>
              </div>

              <div v-else class="mt-4">
                <form @submit.prevent="register">
                  <div class="form-control">
                    <label class="text-lg mx-1">อีเมล</label>
                    <input v-model="registerEmail" type="email" placeholder="" class="input input-bordered" />
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
                    <button type="submit" class="btn btn-primary">สร้างบัญชี</button>
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
          </dialog>

          <div v-if="showSuccessMessageLogin" role="alert" class="alert alert-success absolute bottom-5 right-10 w-60">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current text-white" fill="none"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white">ล็อคอินสำเร็จ</span>
          </div>
        </div>
      </div>
    </div>

    <slot></slot>

    <div class="hero mt-5 rounded-lg mb-5" style="
        background-image: url(https://img.freepik.com/premium-photo/interior-house-apartment-dining-3d-architecture-inside-hall-white-floor-generative-ai_163305-172769.jpg?w=826);
        ">
      <div class="hero-overlay rounded-lg"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold text-white">ติดต่อเรา</h1>
          <p class="mb-5 text-white">
            คลินิกสุขภาพ ความงาม และศัลยกรรม
            โบท็อกซ์ ฟิลเลอร์ ร้อยไหม วิตามินผิว
            เปิดบริการทุกวัน 11.00 - 20.00
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '~/middleware/auth';
import { useAuthStore } from '~/stores/auth.ts';

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

const register = async () => {
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
  }
};


const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value;
};

const handleSearch = () => {
  router.push({ path: '/user/search', query: { search: searchText.value } });
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
