<template>
  <div class="flex items-center bg-base-200 p-4 rounded-lg h-4/6 relative overflow-hidden w-full mt-5">
    <div class="flex space-x-4 transition-transform duration-300 w-[40%]" 
         :style="{ transform: `translateX(-${index * 372}px)`, transition: isTransitioning ? 'transform 0.3s ease' : 'none' }">
      <div class="flex space-x-4 ">
        <!-- Original slides -->
        <div v-for="(promotion, i) in displayedPromotions" :key="i" class="bg-white p-4 rounded-lg w-[360px] h-[375px] flex-shrink-0">
          <img :src="promotion.imageUrl" :alt="promotion.alt" class="object-contain h-full w-full">
        </div>
      </div>
    </div>
    <div class="absolute inset-0 flex items-center justify-between px-4">
      <button @click="prevSlide" class="btn btn-circle bg-white">❮</button>
      <button @click="nextSlide" class="btn btn-circle bg-white">❯</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const index = ref(0);
const isTransitioning = ref(true);
const promotions = ref([]);
const displayedPromotions = ref([]);
const totalClones = ref(0);
const interval = ref(null);

const fetchPromotions = async () => {
  try {
    const response = await fetch('/api/promotions', { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch promotions');
    promotions.value = await response.json();
    preparePromotions();
  } catch (err) {
    console.error('Error fetching promotions:', err);
  }
};

// Function to prepare the promotions array for infinite loop effect
const preparePromotions = () => {
  displayedPromotions.value = [
    ...promotions.value,
    ...promotions.value,
  ]; // Duplicate the array to make it infinite loop-like
  totalClones.value = promotions.value.length;
};

const prevSlide = () => {
  isTransitioning.value = true;
  index.value--;
  if (index.value < 0) {
    index.value = totalClones.value - 1;
  }
};

const nextSlide = () => {
  isTransitioning.value = true;
  index.value++;
  if (index.value >= totalClones.value) {
    index.value = 0;
  }
};

const startAutoSlide = () => {
  interval.value = setInterval(() => {
    nextSlide();
  }, 3000); // Change slide every 3 seconds
};

onMounted(async () => {
  await fetchPromotions();
  startAutoSlide();
});

watch(index, (newIndex) => {
  if (newIndex === promotions.value.length) {
    setTimeout(() => {
      isTransitioning.value = false;
      index.value = 0;
    }, 300); // Quick reset without animation
  }
});
</script>

<style scoped>
.btn-circle {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
