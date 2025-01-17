<template>
  <adminLayouts>
    <div class="bg-white w-full h-full p-2 pt-3 shadow-md rounded-md mt-5">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลยา</h2>
      </div>

      <div class="mb-5">
        <nuxt-link to="/admin/drug/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูลยา</nuxt-link>
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
                <p class="text-cente font-medium">รูป</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อยา</p>
              </th>
              <th>
                <p class="text-center font-medium">ประเภท</p>
              </th>
              <th>
                <p class="text-center font-medium">ราคา</p>
              </th>
              <th>
                <p class="text-center font-medium">ปริมาณ</p>
              </th>
              <th class="">
                <p class="text-center font-medium">ข้อมูลเพิ่มเติม</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(drug, index) in paginatedDrugs" :key="drug.id">
              <th>
                <p class="text-center">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</p>
              </th>
              <td>
                <img :src="drug.imageUrl" alt="drug image" class="w-24 h-24 object-cover cursor-pointer"
                  @click="showImageModal(drug.imageUrl)" />
              </td>
              <td>
                <p class="text-center">{{ drug.name }}</p>
              </td>
              <td>
                <p class="text-center">{{ drug.type }}</p>
              </td>
              <td>
                <p class="text-center">{{ drug.price }}</p>
              </td>
              <td>
                <div class="flex gap-1 justify-center">
                  <p class="text-center">{{ drug.dosage }}</p>
                  <p class="text-center">{{ drug.unit }}</p>
                </div>
              </td>
              <td class="">
                <p class="text-center">{{ drug.about }}</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn bg-red-500 hover:bg-red-300" @click="deleteDrug(drug.id)">
                    <Trash />
                  </button>
                  <!-- <button class="btn btn-accent" @click="editDrug(drug.id)">
                    <Edit />
                  </button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="totalPages > 1" class="join mt-4 flex justify-center gap-2">
          <button v-for="page in totalPages" :key="page"
            :class="['join-item', 'btn', { 'btn-active': currentPage === page }]" @click="goToPage(page)">
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Modal to display the full image -->
      <div v-if="isImageModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <div class="relative">
          <button @click="closeImageModal" class="absolute top-0 right-0 text-white text-3xl">&times;</button>
          <img :src="selectedImage" alt="Full drug image" class="max-w-full max-h-screen object-cover" />
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';
import Swal from 'sweetalert2';

const drugs = ref([]);
const isLoading = ref(true);
const router = useRouter();
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const currentPage = ref(1);
const itemsPerPage = 5; // จำนวนรายการต่อหน้า

// Fetch drugs from the API
const fetchDrugs = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/drug', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    drugs.value = await response.json();
  } catch (error) {
    console.error('Error fetching drugs:', error);
  } finally {
    isLoading.value = false;
  }
};

async function deleteDrug(id) {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบยาชิ้นนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/drug/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting drug: ${response.statusText}`);
      }
      await response.json();

      await Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ!',
        text: 'ยาถูกลบเรียบร้อยแล้ว',
      });

      await fetchDrugs();
    } catch (error) {
      console.log('error : ', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบยาได้ กรุณาลองอีกครั้ง',
      });
    }
  }
}

const editDrug = (id) => {
  router.push(`/admin/drug/edit/${id}`);
};

const paginatedDrugs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return drugs.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(drugs.value.length / itemsPerPage);
});

const goToPage = (page) => {
  currentPage.value = page;
};

const showImageModal = (imageUrl) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

onMounted(async () => {
  await fetchDrugs();
});

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

img.cursor-pointer {
  cursor: pointer;
}

.modal {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
