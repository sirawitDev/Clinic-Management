<script setup>
import UserLayout from '~/layouts/userLayouts.vue';
import Hero from '~/components/user/Hero.vue';
import Coutdown from '~/components/user/Countdown.vue';
import ImageSlider from '~/components/user/ImageSlider.vue';

import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore(); 

onMounted(() => {
  console.log(authStore.user)

  localStorage.removeItem('reservation-data');
})

</script>

<template>
  <UserLayout>
    <!-- Hero -->
    <Hero></Hero>

    <!-- Number Content -->
    <div class="promotion-container p-4 mt-5 rounded-lg h-92">
      <div class="flex">
        <div class="flex-1">
          <div class="mx-2">
            <h2 class="text-7xl font-bold text-[#fefeff] text-stroke tracking-wide">Promotion</h2>
          </div>
        </div>

        <!-- Countdown -->
        <Coutdown></Coutdown>

      </div>
      <ImageSlider></ImageSlider>

    </div>
  </UserLayout>
</template>

<style scoped>
.promotion-container {
  background-image: url('https://img.freepik.com/free-photo/blurred-common-room_1203-106.jpg');
  background-size: cover;
  /* Ensure image covers the entire container */
  background-position: center;
  /* Center the background image */
}

.button-name {
  box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px, rgba(45, 35, 66, 0.15) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transition: box-shadow .15s, transform .15s;
}

.button-name:hover {
  box-shadow: rgba(45, 35, 66, 0.3) 0 4px 8px, rgba(45, 35, 66, 0.2) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-name:focus {
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-name:active {
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
