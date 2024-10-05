<script setup>
import { ref } from 'vue';

const checked = ref(false);
const likes = ref(0);

const handleLikeClick = () => {
    if (checked.value) {
        likes.value--;
    } else {
        likes.value++;
    }
    checked.value = !checked.value;
};
</script>

<template>
    <div>
        <div class="flex items-center space-x-2 cursor-pointer" @click="handleLikeClick">
            <div class="relative w-6 h-6 transition duration-300">
                <input type="checkbox" class="absolute w-full h-full opacity-0 z-20 cursor-pointer" id="Give-It-An-Id"
                    v-model="checked" />
                <div class="flex justify-center items-center w-full h-full">
                    <svg viewBox="0 0 24 24" class="absolute fill-pink-500" :class="{ 'hidden': checked }">
                        <path
                            d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                    </svg>
                    <svg v-show="checked" viewBox="0 0 24 24" class="absolute fill-pink-500">
                        <path
                            d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                    </svg>
                </div>
            </div>
            <div class="text-pink-500 text-sm">{{ likes }}</div>
        </div>
    </div>
</template>