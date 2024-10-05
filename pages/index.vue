<script setup>
import { ref, onMounted } from 'vue';
import adminLayouts from '~/layouts/adminLayout2.vue';
import { useUserStore } from '~/stores/user.ts';
import ApexBarChart from '~/components/admin/ApexBarChart.vue'

const userStore = useUserStore();
const totalPatients = ref(0);

onMounted(() => {
  userStore.fetchUsers().then(() => {
    totalPatients.value = userStore.users.length;
  });
})
</script>

<template>
  <adminLayouts>
    <div class="flex justify-center items-center bg-[#FFD600] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
      <h2 class="text-6xl font-bold text-[#fefeff] text-stroke tracking-wide">DASHBOARD</h2>
    </div>
    <div class="flex justify-center mt-5 p-5 bg-white shadow-md rounded-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div class="card bg-[#2584FF] w-full shadow-xl h-44 transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">ผู้ป่วยทั้งหมด</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5">
              <p class="text-white text-6xl mt-2">{{ totalPatients }} คน</p>
            </div>
            <div class="flex-1 flex justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/users_391194.png" alt="logo_user">
            </div>
          </div>
        </div>
        <div class="card bg-[#00AC97] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">คนใช้บริการวันนี้</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5">
              <p class="text-white text-6xl mt-2">{{ totalPatients }} คน</p>
            </div>
            <div class="flex-1 flex justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/qc_8790314-1.png" alt="logo_user">
            </div>
          </div>
        </div>
        <div class="card bg-[#515262] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">นัดหมายวันนี้</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5">
              <p class="text-white text-6xl mt-2">{{ totalPatients }} คน</p>
            </div>
            <div class="flex-1 flex justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/job_10485121.png" alt="logo_user">
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="flex gap-3">
      <div class="flex-1">
        <div class="p-4 bg-white mt-5 shadow-md rounded-md">
          <ApexBarChart />
        </div>
      </div>
      <div class="flex-1">
        <div class="p-4 bg-white mt-5 shadow-md rounded-md">
          asdasd
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

</style>