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
  <div class="h-8 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hidden sm:block"></div>

  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="flex flex-col h-full w-24 bg-zinc-50 shadow-md hidden sm:block">
      <!-- Image -->
      <div class="pt-5">
        <RouterLink to="/admin">
          <img class="" src="https://img2.pic.in.th/pic/-removebg-preview344b007cb6dec167.png" alt="logo">
        </RouterLink>
      </div>

      <!-- Profile Avatar at the bottom -->
      <div class="mt-5 mx-5 mb-10">
        <div class="relative">
          <ul v-if="openProfile"
            class=" bg-base-100 rounded-box z-[1] p-2 shadow absolute -top-18 left-14">
            <li>
              <button @click="authStore.logout()" class=" cursor-pointer w-28">
                <p class="text-center hover:-translate-y-1">ออกจากระบบ</p>
              </button>
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
