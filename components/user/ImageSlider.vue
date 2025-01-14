<template>
  <div class="flex items-center bg-base-200 p-4 rounded-lg h-4/6 relative overflow-hidden w-full mt-5">
    <div 
      class="flex space-x-4 transition-transform duration-300 w-[40%]"
      :style="{ 
        transform: `translateX(-${currentTranslate}px)`,
        transition: isTransitioning ? 'transform 0.3s ease' : 'none' 
      }"
      @transitionend="handleTransitionEnd"
    >
      <div class="flex space-x-4">
        <div 
          v-for="(promotion, i) in displayedPromotions" 
          :key="i" 
          class="bg-white p-4 rounded-lg w-[360px] h-[375px] flex-shrink-0"
        >
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
import { ref, onMounted, computed } from 'vue';

const currentIndex = ref(0);
const isTransitioning = ref(true);
const promotions = ref([]);
const displayedPromotions = ref([]);
const interval = ref(null);
const slideWidth = 372; // Width of each slide including margin

const currentTranslate = computed(() => currentIndex.value * slideWidth);

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

const preparePromotions = () => {
  // Create a triple-length array for smooth infinite scrolling
  displayedPromotions.value = [
    ...promotions.value,
    ...promotions.value,
    ...promotions.value
  ];
  // Start from the middle set to allow backward scrolling
  currentIndex.value = promotions.value.length;
};

const handleTransitionEnd = () => {
  isTransitioning.value = true;
  // If we've scrolled to the last set, jump to the middle set
  if (currentIndex.value >= displayedPromotions.value.length - promotions.value.length) {
    isTransitioning.value = false;
    currentIndex.value = promotions.value.length;
  }
  // If we've scrolled to the first set, jump to the middle set
  else if (currentIndex.value <= promotions.value.length - 1) {
    isTransitioning.value = false;
    currentIndex.value = displayedPromotions.value.length - (promotions.value.length * 2);
  }
};

const prevSlide = () => {
  isTransitioning.value = true;
  currentIndex.value--;
};

const nextSlide = () => {
  isTransitioning.value = true;
  currentIndex.value++;
};

const startAutoSlide = () => {
  interval.value = setInterval(() => {
    nextSlide();
  }, 3000);
};

onMounted(async () => {
  await fetchPromotions();
  startAutoSlide();
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