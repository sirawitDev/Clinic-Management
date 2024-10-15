<template>
    <div class="flex-1">
        <div class="grid grid-flow-col gap-3 text-center auto-cols-max justify-end items-end">
            <div class="flex flex-col p-2 bg-white rounded-box text-neutral-content shadow-md">
                <span class="countdown text-3xl justify-center text-[#f1d18a]">{{ days }}</span>
                <p class="text-[#f1d18a]">days</p>
            </div>
            <div class="flex flex-col p-2 bg-white rounded-box text-neutral-content shadow-md">
                <span class="countdown text-3xl justify-center text-[#f1d18a]">{{ hours }}</span>
                <p class="text-[#f1d18a]">hours</p>
            </div>
            <div class="flex flex-col p-2 bg-white rounded-box text-neutral-content shadow-md">
                <span class="countdown text-3xl justify-center text-[#f1d18a]">{{ minutes }}</span>
                <p class="text-[#f1d18a]">min</p>
            </div>
            <div class="flex flex-col p-2 bg-white rounded-box text-neutral-content shadow-md">
                <span class="countdown text-3xl justify-center text-[#f1d18a]">{{ seconds }}</span>
                <p class="text-[#f1d18a]">sec</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const days = ref('');
const hours = ref('');
const minutes = ref('');
const seconds = ref('');

const targetDate = new Date('2024-12-31T23:59:59').getTime();

onMounted(() => {
    startCountdown();
});

const startCountdown = () => {
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
        hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds.value = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(countdownInterval);
            days.value = '0';
            hours.value = '0';
            minutes.value = '0';
            seconds.value = '0';
        }
    }, 1000);
};
</script>
