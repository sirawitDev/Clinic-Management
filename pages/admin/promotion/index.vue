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

      <div class="overflow-x-auto">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr>
              <th><p class="text-center">ID</p></th>
              <th><p class="text-center">ชื่อโปรโมชั่น</p></th>
              <th><p class="text-center">รูปภาพ</p></th>
              <th><p class="text-center">วันที่เริ่ม</p></th>
              <th><p class="text-center">วันที่สิ้นสุด</p></th>
              <th><p class="text-center">สถานะ</p></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(promotion, index) in promotions" :key="promotion.id">
              <th>
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td>
                <p class="text-center">{{ promotion.name }}</p>
              </td>
              <td class="flex justify-center">
                <img 
                  :src="promotion.imageUrl" 
                  alt="Promotion Image" 
                  class="w-16 h-auto cursor-pointer" 
                  @click="openModal(promotion.imageUrl)" 
                />
              </td>
              <td><p class="text-center">{{ new Date(promotion.startDate).toLocaleDateString() }}</p></td>
              <td><p class="text-center">{{ new Date(promotion.endDate).toLocaleDateString() }}</p></td>
              <td><p class="text-center">{{ promotion.status }}</p></td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deletePromotion(promotion.id)">
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
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="closeModal">
        <img 
          :src="modalImage" 
          alt="Expanded Promotion Image" 
          class="max-w-full max-h-full cursor-auto" 
          @click.stop="closeModal"
        />
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const promotions = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false); // State for modal visibility
const modalImage = ref(''); // State for the image URL to be displayed in the modal
const router = useRouter();
const error = ref(null);

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
    await fetchPromotions(); // Refresh the list after deletion
  } catch (err) {
    error.value = err.message;
  }
};

const editPromotion = (promotionId) => {
  router.push(`/admin/promotion/edit/${promotionId}`);
};

// Open Modal with image URL
const openModal = (imageUrl) => {
  modalImage.value = imageUrl; // Set the image URL
  isModalOpen.value = true; // Show the modal
};

// Close Modal
const closeModal = () => {
  isModalOpen.value = false; // Hide the modal
  modalImage.value = ''; // Clear the image URL
};

onMounted(fetchPromotions);

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
  font-size: small;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
