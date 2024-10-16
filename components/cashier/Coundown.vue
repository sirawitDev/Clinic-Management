<template>
  <div class="flex justify-center mt-3">
    <h1 class="text-2xl mx-2">ชำระเงินภายใน</h1>
    <span class="countdown font-mono text-2xl mt-1">
      <span>{{ minutes }}</span>:<span>{{ seconds }}</span>
    </span>
    <h1 class="text-2xl mx-2">นาที</h1>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  startCountdown: {
    type: Boolean,
    default: false,
  },
});

const minutes = ref(3);
const seconds = ref(0);
let timer;

watch(
  () => props.startCountdown,
  (newVal) => {
    if (newVal) {
      startTimer();
    } else {
      resetTimer();
    }
  }
);

const startTimer = () => {
  minutes.value = 3;
  seconds.value = 0;

  timer = setInterval(() => {
    if (seconds.value === 0) {
      if (minutes.value === 0) {
        clearInterval(timer);
        return;
      }
      minutes.value--;
      seconds.value = 59;
    } else {
      seconds.value--;
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer);
  minutes.value = 3;
  seconds.value = 0;
};
</script>

<style scoped>
.countdown {
  font-weight: bold;
}
</style>
