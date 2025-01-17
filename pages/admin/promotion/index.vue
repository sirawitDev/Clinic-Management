<template>
  <adminLayouts>
    <div class="bg-white w-full h-full p-2 pt-3 shadow-md rounded-md mt-5">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลโปรโมชั่น</h2>
      </div>
      <div class="mb-5">
        <nuxt-link to="/admin/promotion/create" class="btn btn-accent w-full text-white font-light mt-5">
          เพิ่มข้อมูล
        </nuxt-link>
      </div>

      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <table v-else class="table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center font-medium">ลำดับ</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อโปรโมชั่น</p>
              </th>
              <th>
                <p class="text-center font-medium">รูปภาพ</p>
              </th>
              <th>
                <p class="text-center font-medium">วันที่เริ่ม</p>
              </th>
              <th>
                <p class="text-center font-medium">วันที่สิ้นสุด</p>
              </th>
              <th>
                <p class="text-center font-medium">สถานะ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(promotion, index) in promotions" :key="promotion.id">
              <th class=" border-slate-500">
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td class=" border-slate-500">
                <p class="text-center">{{ promotion.name }}</p>
              </td>
              <td class="flex justify-center border-slate-500">
                <img :src="`${promotion.imageUrl}`" alt="Promotion Image" class="w-16 h-auto cursor-pointer"
                  @click="openModal(`${promotion.imageUrl}`)" @error="onImageError"/>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ new Date(promotion.startDate).toLocaleDateString() }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ new Date(promotion.endDate).toLocaleDateString() }}</p>
              </td>
              <td class=" border-slate-500">
                <p class="text-center">{{ promotion.status }}</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn bg-red-500 hover:bg-red-300" @click="deletePromotion(promotion.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="editPromotion(promotion.id)">
                    <Edit />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal for Image Preview -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        @click="closeModal">
        <img :src="modalImage" alt="Expanded Promotion Image" class="max-w-full max-h-full cursor-auto"
          @click.stop="closeModal" />
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Swal from 'sweetalert2';

import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const promotions = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const modalImage = ref('');
const router = useRouter();
const error = ref(null);

const configDomain = useRuntimeConfig().public.domain;

const fetchPromotions = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/promotions', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    promotions.value = await response.json();
  } catch (err) {
    console.error('Error fetching promotions:', err);
    error.value = "Error fetching promotions.";
  } finally {
    isLoading.value = false;
  }
};

const deletePromotion = async (promotionId) => {
  const { isConfirmed } = await Swal.fire({
    title: 'ยืนยันการลบโปรโมชั่น',
    text: 'คุณต้องการลบโปรโมชั่นนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/promotions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: promotionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete promotion');
    }
    await fetchPromotions();

    Swal.fire({
      icon: 'success',
      title: 'โปรโมชั่นถูกลบเรียบร้อย',
      text: 'โปรโมชั่นของคุณถูกลบสำเร็จแล้ว',
    });

  } catch (err) {
    console.error('Error deleting promotion:', err);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถลบโปรโมชั่นได้',
    });
  }
};

const editPromotion = (promotionId) => {
  router.push(`/admin/promotion/edit/${promotionId}`);
};


const openModal = (imageUrl) => {
  modalImage.value = imageUrl;
  isModalOpen.value = true
};

// Close Modal
const closeModal = () => {
  isModalOpen.value = false
  modalImage.value = ''
};

onMounted(async() => {
  await fetchPromotions()
  console.log('domain : ' , domain)
})

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
