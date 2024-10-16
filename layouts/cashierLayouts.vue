<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth.ts';

const authStore = useAuthStore()

const drawerOpen = ref(false);
const openProfile = ref(false);

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  openProfile.value = !openProfile.value;
}

const closeProfileDropdown = () => {
  openProfile.value = false;
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.profile-dropdown');
  const button = document.querySelector('.avatar-button');

  if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
    closeProfileDropdown();
  }
};

window.addEventListener('click', handleClickOutside);

authStore.initializeAuth()

onMounted(() => {

})
</script>


<template>
  <div class="h-8 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>

  <!-- <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />
    <div class="drawer-content bg-white">
      <div class="mx-auto max-w-full pr-10 pl-10">
        <slot></slot>
      </div>
    </div>
    <div class="drawer-side bg-zinc-200 shadow-md">
      <label for="my-drawer-2" class="drawer-overlay lg:hidden" @click="drawerOpen = false"></label>
      <ul class="menu p-4 w-[108px] h-[60%]">
        <RouterLink to="/admin" class="mt-2">
          <img class="" src="https://img2.pic.in.th/pic/-removebg-preview344b007cb6dec167.png" alt="logo">
        </RouterLink>
        <div>
          <button @click="drawerOpen = false" class="lg:hidden flex items-center p-2 mb-4">
            <font-awesome-icon :icon="['fa', 'times']" class="text-xl text-zinc-600 mr-2"></font-awesome-icon>
            <p class="text-base text-zinc-600">ปิดเมนู</p>
          </button>
        </div>

        <li class="mt-10">
          <RouterLink to="/cashier" v-slot="{ isActive }">
            <div :class="['flex items-center justify-center', isActive ? 'text-blue-500' : 'text-gray-700']">
              <font-awesome-icon :icon="['fas', 'house']" class="text-2xl mx-2" />
            </div>
          </RouterLink>
        </li>

        <li class="mt-10">
          <RouterLink to="/cashier/setting" v-slot="{ isActive }" class="items-center text-center">
            <div :class="['flex items-center justify-center', isActive ? 'text-blue-500 font-bold' : 'text-gray-700']">
              <font-awesome-icon :icon="['fas', 'gear']" class="text-2xl mx-2" />
            </div>
          </RouterLink>
        </li>
        
      </ul>
    </div>
    <div class="absolute bottom-14 left-">
      <div class="relative">
        <ul v-if="openProfile"
          class="profile-dropdown bg-base-100 rounded-box z-[1] w-52 p-2 shadow absolute right-0 top-12">
          <li><a class="justify-between">โปรไฟล์</a></li>
          <li><a>ตั้งค่า</a></li>
          <li><a>ออกจากระบบ</a></li>
        </ul>
        <div class="mx-5">
          <button class="btn btn-ghost btn-circle avatar avatar-button" @click="toggleProfileDropdown">
            <div class="w-10 h-10 rounded-full overflow-hidden">
              <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div> -->

  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="flex flex-col w-24 bg-zinc-50 shadow-md">
      <!-- Image -->
      <div class="pt-5">
        <RouterLink to="/admin">
          <img class="" src="https://img2.pic.in.th/pic/-removebg-preview344b007cb6dec167.png" alt="logo">
        </RouterLink>
      </div>

      <ul>
        <li class="mt-10">
          <RouterLink to="/cashier" v-slot="{ isActive }">
            <div :class="['flex items-center justify-center', isActive ? 'text-blue-500' : 'text-gray-700']">
              <font-awesome-icon :icon="['fas', 'house']" class="text-2xl mx-2" />
            </div>
          </RouterLink>
        </li>
        <li>
          <div class="mt-10">
            <RouterLink to="/cashier/list" v-slot="{ isActive }">
              <div :class="['flex items-center justify-center', isActive ? 'text-blue-500' : 'text-gray-700']">
                <font-awesome-icon :icon="['fas', 'list']" class="text-2xl mx-2" />
              </div>
              <h1></h1>
            </RouterLink>
          </div>
        </li>
      </ul>


      <!-- Profile Avatar at the bottom -->
      <div class="mt-auto mx-5 mb-10">
        <div class="relative">
          <ul v-if="openProfile"
            class="profile-dropdown bg-base-100 rounded-box z-[1] p-2 shadow absolute right-0 top-9">
            <li>
              <a @click="authStore.logout()" class=" cursor-pointer">
                <p class="text-center hover:-translate-y-1">ออกจากระบบ</p>
              </a>
            </li>
          </ul>
          <div>
            <button class="btn btn-ghost btn-circle avatar avatar-button" @click="toggleProfileDropdown">
              <div class="w-16 h-12 rounded-full overflow-hidden">
                <img alt="User Avatar" src="https://img2.pic.in.th/pic/machine_14756003.png" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-grow bg-white pr-10 pl-10">
      <slot></slot>
    </div>
  </div>


</template>


<style scoped>
* {
  font-family: 'Kanit', sans-serif;
}



.menu li a {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.drawer-side {
  height: 100vh;
  overflow-y: auto;
}

.profile-dropdown {
  position: absolute;
  right: -8rem;
  top: -3rem;
  width: 150px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar-button {
  cursor: pointer;
  position: relative;
}
</style>
