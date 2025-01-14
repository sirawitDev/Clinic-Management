<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';
import Swal from 'sweetalert2';

import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'

const physicians = ref([]);
const isLoading = ref(true);
const router = useRouter();

const fetchPhysicians = async () => {
  try {
    const response = await fetch('/api/physician', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    physicians.value = await response.json();
  } catch (error) {
    console.error('Error fetching physicians:', error);
  } finally {
    isLoading.value = false;
  }
};

async function deletePhysician(id) {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบผู้ใช้นี้หรือไม่? การลบไม่สามารถย้อนกลับได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/physician/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting physician: ${response.statusText}`);
      }
      await response.json();

      Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ!',
        text: 'ผู้ใช้ถูกลบเรียบร้อยแล้ว',
      });

      await fetchPhysicians();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบผู้ใช้ได้ กรุณาลองอีกครั้ง',
      });
      console.error('Error deleting physician:', error);
    }
  }
}

const editPhysician = (id) => {
  router.push(`/admin/physicians/edit/${id}`);
};

onMounted(async () => {
  await fetchPhysicians()
});

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <AdminLayout>
    <div class=" mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการบุคลากรภายในคลินิก
        </h2>
      </div>

      <div class="mb-5">
        <nuxt-link to="/admin/physicians/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>

      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center font-medium">ลำดับ</p>
              </th>
              <th>
                <p class="text-center font-medium">คำนำหน้า</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อ</p>
              </th>
              <th>
                <p class="text-center font-medium">นามสกุล</p>
              </th>
              <th>
                <p class="text-center font-medium">ตำแหน่ง</p>
              </th>
              <th>
                <p class="text-center font-medium">เบอร์โทรศัพท์</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(physician, index) in physicians" :key="physician.id">
              <th class=" border-slate-500">
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td class=" border-slate-500">
                <p class="text-center">{{ physician.title }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ physician.first_name }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ physician.last_name }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ physician.about }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ physician.phone }}</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deletePhysician(physician.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="editPhysician(physician.id)">
                    <Edit />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
