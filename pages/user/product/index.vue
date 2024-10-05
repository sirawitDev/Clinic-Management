<script setup>
import userLayouts from '../../layouts/userLayouts.vue';
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
    <div class="container mx-auto">
      <div class="flex justify-center items-center">
        <div class="flex bg-[#FFD600] rounded-full w-[27%] h-20 justify-center items-center bg-opacity-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <p class="text-xl sm:text-3xl md:text-3xl lg:text-5xl font-semibold text-left text-[#fefeff] stroke-text" style="text-shadow: 1px 1px 0 #FF8128, -1px -1px 0 #FF8128, 1px -1px 0 #FF8128, -1px 1px 0 #FF8128;">
            ข้อมูลสินค้า
          </p>
        </div>
      </div>

      <div class="mt-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="(product, index) in products" :key="product.id" class="card h-[450px] w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <figure class="w-full h-48 overflow-hidden rounded-lg">
              <img class=" w-[200px] h-[200px] object-cover transition-transform duration-500 hover:scale-105" :src="product.imageUrl" :alt="product.name" />
            </figure>
            <div class="card-body p-4">
              <h2 class="card-title text-lg font-semibold">{{ product.name }}</h2>
              <p class="font-light text-sm mt-2">
                {{ isExpanded(index) ? product.about : truncatedText(product) }}
                <span v-if="!isExpanded(index) && isTruncated(product)">...</span>
                <button v-if="isTruncated(product)" @click="toggleReadMore(index)" class="text-blue-500 underline ml-2">
                  {{ isExpanded(index) ? 'Read Less' : 'Read More' }}
                </button>
              </p>
              <div class="flex justify-between">
                <div>
                  <p class=" font-bold text-lg">ราคา : {{ product.price }} THB</p>
                </div>
                <div :class="['badge', product.status === 'close' ? 'badge-error' : 'badge-success']" class="mt-1">
                  {{ product.status }}
                </div>
              </div>
              <div class="card-actions justify-end mt-4">
                <button @click="addToCart(product)" class="btn btn-ghost w-full text-white bg-[#FFD600] bg-opacity-50 border border-gray-200 shadow-sm">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
.text-blue-500 {
    color: #3b82f6;
}

.underline {
    text-decoration: underline;
}

.ml-2 {
    margin-left: 0.5rem;
}
</style>
