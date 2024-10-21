<script setup>
import userLayouts from '~/layouts/userLayouts.vue';
import { ref, onMounted } from 'vue';

import { useUserCartStore } from '~/stores/users/cart.ts'

const userCartStore = useUserCartStore()

const products = ref([]);
const maxLength = 50;
const expandedStates = ref([]);

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/product', {
      method: 'GET',
    });
    const data = await response.json();
    products.value = data;
    expandedStates.value = data.map(() => false);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const isExpanded = (index) => expandedStates.value[index];
const toggleReadMore = (index) => {
    expandedStates.value[index] = !expandedStates.value[index];
};

const isTruncated = (product) => product.about.length > maxLength;
const truncatedText = (product) => product.about.substring(0, maxLength);

const addToCart = (product) => {
    try {
        userCartStore.addToCart(product)
    } catch (error) {
        console.log('error', error)
    }
}

onMounted(fetchProducts);
</script>

<template>
  <userLayouts>
    <div class="container mx-auto font-kanit">
      <div class="flex justify-center items-center">
        <div class="flex bg-[#FFD600] rounded-full sm:w-[27%] w-[60%] sm:h-20 h-14 justify-center items-center bg-opacity-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">สินค้า</h2>
        </div>
      </div>

      <div class="mt-5">
        <div class="grid sm:grid-cols-4 grid-cols-1 sm:gap-6 gap-2">
          <div v-for="(product, index) in products" :key="product.id" class="card sm:h-[450px] h-[280px] sm:w-72 w-[350px] bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
            <figure class="w-full h-48 overflow-hidden rounded-lg">
              <img class=" sm:w-[200px] w-[100px] sm:h-[200px] h-[100px] object-cover transition-transform duration-500 hover:scale-105" :src="product.imageUrl" :alt="product.name" />
            </figure>
            <div class="card-body sm:p-4 p-1">
              <h2 class="card-title sm:text-lg text-[16px] font-semibold">{{ product.name }}</h2>
              <p class="font-light sm:text-sm text-[14px] mt-2 sm:p-3 p-1 rounded-md">
                {{ isExpanded(index) ? product.about : truncatedText(product) }}
                <span v-if="!isExpanded(index) && isTruncated(product)">...</span>
                <button v-if="isTruncated(product)" @click="toggleReadMore(index)" class="text-blue-500 underline ml-2">
                  {{ isExpanded(index) ? 'Read Less' : 'Read More' }}
                </button>
              </p>

              <div class="flex justify-between">
                <div>
                  <p class=" font-bold sm:text-lg text-[18px] p-1">ราคา : {{ product.price }} บาท</p>
                </div>
                <div :class="['badge', product.status === 'close' ? 'badge-error' : 'badge-success']" class="mt-2 mr-1">
                  <p class="text-white sm:text-base text-[14px]">{{ product.status }}</p>
                </div>
              </div>
              <!-- <div class="card-actions justify-end mt-4">
                <button @click="addToCart(product)" class="btn btn-ghost w-full text-white bg-[#FFD600] bg-opacity-50 border border-gray-200 shadow-sm">Buy Now</button>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
.underline {
    text-decoration: underline;
}
.font-kanit {
  font-family: 'Kanit', sans-serif;
}

.text-stroke {
  text-shadow: -4px 0px 0 #FF8128, 1px -1px 0 #FF8128, -4px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
