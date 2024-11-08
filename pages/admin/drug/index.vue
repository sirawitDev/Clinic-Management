<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-base-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลยา</h2>
      </div>

      <div class="overflow-x-auto mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr>
              <th><p class="text-center">ลำดับ</p></th>
              <th><p class="text-center">รูป</p></th>
              <th><p class="text-center">ชื่อยา</p></th>
              <th><p class="text-center">ประเภท</p></th>
              <th><p class="text-center">ราคา</p></th>
              <th><p class="text-center">ปริมาณ</p></th>
              <th class="hidden sm:block"><p class="text-center">ข้อมูลเพิ่มเติม</p></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(drug, index) in paginatedDrugs" :key="drug.id">
              <th><p class="text-center">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</p></th>
              <td>
                <img :src="drug.imageUrl" alt="drug image" class="w-24 h-24 object-cover cursor-pointer"
                  @click="showImageModal(drug.imageUrl)" />
              </td>
              <td><p class="text-center">{{ drug.name }}</p></td>
              <td><p class="text-center">{{ drug.type }}</p></td>
              <td><p class="text-center">{{ drug.price }}</p></td>
              <td>
                <div class="flex gap-1 justify-center">
                  <p class="text-center">{{ drug.dosage }}</p>
                  <p class="text-center">{{ drug.unit }}</p>
                </div>
              </td>
              <td class="hidden sm:block"><p class="text-center">{{ drug.about }}</p></td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deleteDrug(drug.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="editDrug(drug.id)">
                    <Edit />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="join mt-4 flex justify-center gap-2">
          <button 
            v-for="page in totalPages" 
            :key="page" 
            :class="['join-item', 'btn', { 'btn-active': currentPage === page }]" 
            @click="goToPage(page)">
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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

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

// Function to delete a drug
async function deleteDrug(id: number) {
  const confirmed = window.confirm('คุณแน่ใจหรือว่าต้องการลบยาชิ้นนี้?');
  if (confirmed) {
    try {
      const response = await fetch(`/api/drug/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting drug: ${response.statusText}`);
      }
      await response.json();
      await fetchDrugs();
    } catch (error) {
      console.log('error : ', error);
    }
  }
}

// Function to edit a drug
const editDrug = (id: number) => {
  router.push(`/admin/drug/edit/${id}`);
};

// Computed property for pagination
const paginatedDrugs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return drugs.value.slice(start, start + itemsPerPage);
});

// Computed property to calculate total pages
const totalPages = computed(() => {
  return Math.ceil(drugs.value.length / itemsPerPage);
});

// Change page function
const goToPage = (page) => {
  currentPage.value = page;
};

// Modal handlers
const showImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

// Fetch drugs when component is mounted
onMounted(async () => {
  await fetchDrugs();
});

// Define middleware for page meta
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
  text-align: center;
}

.table th {
  background-color: #f4f4f4;
  font-size: small;
}

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
