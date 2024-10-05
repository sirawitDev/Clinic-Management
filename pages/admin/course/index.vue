<template>
  <adminLayouts>
    <div class="bg-white w-full h-full pl-5 pt-3 shadow-md rounded-md mt-5">
      <div class="flex justify-center items-center bg-[#FFD600] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลคอร์ส</h2>
      </div>
      <div class="mb-5">
        <nuxt-link to="/admin/promotion/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import adminLayouts from '~/layouts/adminLayout2.vue'
</script>

<style>

</style>