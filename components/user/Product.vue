<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
    products: Array,
    addToCart: Function,
});

const maxLength = 50;

const expandedStates = ref(props.products.map(() => false));

const isExpanded = (index) => expandedStates.value[index];
const toggleReadMore = (index) => {
    expandedStates.value[index] = !expandedStates.value[index];
};

const isTruncated = (product) => product.about.length > maxLength;
const truncatedText = (product) => product.about.substring(0, maxLength);
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-10">
        <div v-for="(product, index) in products" :key="index"
            class="card h-[450px] w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <figure class="w-full h-48 overflow-hidden rounded-lg">
                <img class=" w-[200px] h-[200px] object-cover transition-transform duration-500 hover:scale-105"
                    :src="product.imageUrl" alt="imageProduct" />
            </figure>
            <div class="card-body p-4">
                <h2 class="card-title text-lg font-semibold">{{ product.name }}</h2>
                <p class="font-light text-sm mt-2">
                    {{ isExpanded(index) ? product.about : truncatedText(product) }}
                    <span v-if="!isExpanded(index) && isTruncated(product)">...</span>
                    <button v-if="isTruncated(product)" @click="toggleReadMore(index)"
                        class="text-blue-500 underline ml-2">
                        {{ isExpanded(index) ? 'Read Less' : 'Read More' }}
                    </button>
                </p>
                <div class="flex justify-between">
                    <div>
                        <p class=" font-bold text-lg">ราคา : {{ product.price }}</p>
                    </div>
                    <div :class="['badge', product.status === 'close' ? 'badge-error' : 'badge-success']" class="mt-1">
                        {{ product.status }}
                    </div>
                </div>
                <div class="card-actions justify-end mt-4">
                    <button @click="addToCart(product)"
                        class="btn btn-ghost w-full text-white bg-[#FFD600] bg-opacity-50 border border-gray-200 shadow-sm">Buy
                        Now</button>
                </div>
            </div>
        </div>
    </div>
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