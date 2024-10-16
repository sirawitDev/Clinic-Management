<template>
  <ul class="flex justify-center items-center space-x-4">


    <li
      class="relative bg-white rounded-full w-12 h-12 flex flex-col justify-center items-center shadow-md cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-400">
      <a href="https://www.facebook.com/profile.php?id=100063971706505" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 320 512" height="1.2em" fill="#60a5fa" class="facebook">
          <path
            d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
          </path>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script setup>
</script>

<style scoped>
.tooltip {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

li:hover .tooltip {
  opacity: 1;
}
</style>
