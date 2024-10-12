<template>
  <UserLayout>
    <div class=" container mx-auto">
      <div class="flex justify-center">
        <div
          class="font-kanit flex justify-center items-center bg-[#FFD600] w-[27%] h-20 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">โปรโมชั่น</h2>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 mt-10">
        <div v-for="(promotion , index) in promotions" :key="promotion.id" class="card bg-base-100 w-96 shadow-xl">
          <figure class="w-full h-48 overflow-hidden rounded-lg">
              <img class=" w-[200px] h-[200px] object-cover transition-transform duration-500 hover:scale-105" :src="promotion.imageUrl" :alt="promotion.name" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              <p>{{ promotion.name }}</p>
              <div class="badge badge-secondary">NEW</div>
            </h2>
            <p>{{ promotion.about }}</p>
            <div class="card-actions justify-end mt-2">
              <div class="badge badge-outline">เติมวิตามินผิว</div>
              <div class="badge badge-outline">โบท็อกซ์</div>
              <div class="badge badge-outline">ฟิลเลอร์</div>
              <div class="badge badge-outline">มาเด้คอลลาเจน</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script lang="ts" setup>
import UserLayout from '~/layouts/userLayouts.vue';

const promotions = ref([])

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

onMounted(async () => {
  await fetchProducts()
  console.log('promotion', promotion.value)
})
</script>

<style scoped>
.font-kanit {
  font-family: 'Kanit', sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>