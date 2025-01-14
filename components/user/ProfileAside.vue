<!-- components/ProfileAside.vue -->
<template>
  <aside class="w-1/4 p-5 border-r border-base-200">
    <div class="font-bold text-xl mb-3 flex justify-center">ข้อมูลเพิ่มเติม</div>
    <ul>
      <li><RouterLink to="/user/profile" class="btn btn-accent w-full rounded-full text-white font-light mt-2 text-base">ตั้งค่าโปรไฟล์</RouterLink></li>
      <li><RouterLink to="/user/profile/addresses" class="btn btn-accent w-full rounded-full text-white font-light mt-2 text-base">ข้อมูลที่อยู่</RouterLink></li>
      <li><RouterLink to="/user/profile/medicalhistory" class="btn btn-accent w-full rounded-full text-white font-light mt-2 text-base">ประวัติการรักษา</RouterLink></li>
      <li><RouterLink to="/user/profile/bookinghistory" class="btn btn-accent w-full rounded-full text-white font-light mt-2 text-base">ประวัติการจอง</RouterLink></li>
      <li><div @click="authStore.logout()" class="btn bg-red-500 hover:bg-red-400 w-full rounded-full text-white font-light mt-2 text-base">ออกจากระบบ</div></li>
    </ul>
  </aside>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore()
</script>
