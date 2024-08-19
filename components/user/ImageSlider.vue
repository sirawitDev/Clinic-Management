<template>
  <div class="flex items-center bg-base-200 p-4 rounded-lg h-4/6 relative overflow-hidden w-full mt-5">
      <div class="flex space-x-4 transition-transform duration-300 w-[40%]" :style="{ transform: `translateX(-${index * 372}px)` }">
          <div class="flex space-x-4 ">
              <div v-for="(image, i) in images" :key="i"
                  class="bg-white p-4 rounded-lg w-[360px] h-[375px] flex-shrink-0"
                  :style="{ marginLeft: `${i === 0 ? '0' : '12px'}` }">
                  <img :src="image.src" :alt="image.alt" class="object-contain h-full w-full">
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
import { ref, onMounted } from 'vue';

const index = ref(0);
const images = ref([
  { src: 'https://img2.pic.in.th/pic/pic11.md.jpg', alt: 'pic1' },
  { src: 'https://img5.pic.in.th/file/secure-sv1/pic3016a9f8d2babfbd7.png', alt: 'pic2' },
  { src: 'https://img5.pic.in.th/file/secure-sv1/pic11bbda4fbe7060204.png', alt: 'pic3' },
  { src: 'https://img5.pic.in.th/file/secure-sv1/pic27bee654de7959063.png', alt: 'pic4' },
  { src: 'https://img5.pic.in.th/file/secure-sv1/pic11bbda4fbe7060204.png', alt: 'pic5' },
  { src: 'https://img5.pic.in.th/file/secure-sv1/pic12.md.jpg', alt: 'pic5' },
]);

onMounted(() => {
  startAutoSlide();
});

const prevSlide = () => {
  index.value = index.value > 0 ? index.value - 1 : images.value.length - 1;
};

const nextSlide = () => {
  index.value = index.value < images.value.length - 1 ? index.value + 1 : 0;
  if (index.value === 3) {
      // Reset index to 0 when reaching the last image
      setTimeout(() => {
          index.value = 0;
      }, 3000); // Delay resetting for 3 seconds
  }
};

const startAutoSlide = () => {
  setInterval(() => {
      nextSlide();
  }, 3000); // Change slide every 3 seconds
};
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