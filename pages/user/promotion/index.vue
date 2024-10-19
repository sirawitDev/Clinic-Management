<template>
  <UserLayout>
    <div class="font-kanit container mx-auto">
      <div class="flex justify-center">
        <div
          class="font-kanit flex justify-center items-center bg-[#FFD600] sm:w-[27%] w-[60%] sm:h-20 h-14 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">โปรโมชั่น</h2>
        </div>
      </div>
      <div class="grid sm:grid-cols-3 grid-cols-1 gap-4 mt-10">
        <div v-for="(promotion, index) in promotions" :key="promotion.id" class="card bg-base-100 sm:w-96 w-[full] shadow-xl sm:mx-1 mx-8">
          <figure class="w-full h-48 overflow-hidden rounded-lg">
            <img
              class="w-[200px] h-[200px] object-cover transition-transform duration-500 hover:scale-105 p-2 cursor-pointer"
              :src="promotion.imageUrl"
              :alt="promotion.name"
              @click="openModal(promotion.imageUrl)"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              <p>{{ promotion.name }}</p>
              <div class="badge badge-secondary font-light text-white sm:w-14 w-10"><p class="sm:text-base text-[10px]">NEW</p></div>
            </h2>
            <p>{{ promotion.about }}</p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-lg">
          <img class="w-full h-full object-cover" :src="selectedImageUrl" alt="Promotion Image" />
          <button class="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1" @click="closeModal">X</button>
        </div>
      </div>
    </div>
  </UserLayout>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import UserLayout from '~/layouts/userLayouts.vue';

const promotions = ref([]);
const isModalOpen = ref(false);
const selectedImageUrl = ref<string | null>(null);

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/promotions', {
      method: 'GET',
    });
    const data = await response.json();
    promotions.value = data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const openModal = (imageUrl: string) => {
  selectedImageUrl.value = imageUrl;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedImageUrl.value = null;
};

onMounted(async () => {
  await fetchProducts();
  console.log('promotion', promotions.value);
});
</script>


<style scoped>
.font-kanit {
  font-family: 'Kanit', sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
