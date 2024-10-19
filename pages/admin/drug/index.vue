<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลยา</h2>
      </div>

      <div class="mb-5">
        <nuxt-link to="/admin/drug/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>

      <div class="overflow-x-auto w-full">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr>
              <th>
                <p class="text-center">ID</p>
              </th>
              <th>
                <p class="text-center">รูป</p>
              </th>
              <th>
                <p class="text-center">ชื่อยา</p>
              </th>
              <th>
                <p class="text-center">ประเภท</p>
              </th>
              <th>
                <p class="text-center">ราคา</p>
              </th>
              <th>
                <p class="text-center">ปริมาณ</p>
              </th>
              <th class=" hidden sm:block">
                <p class="text-center">ข้อมูลเพิ่มเติม</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(drug, index) in drugs" :key="drug.id">
              <th>{{ index + 1 }}</th>
              <td>
                <img :src="drug.imageUrl" alt="drug image" class="w-24 h-24 object-cover cursor-pointer"
                  @click="showImageModal(drug.imageUrl)" />
              </td>
              <td>{{ drug.name }}</td>
              <td>{{ drug.type }}</td>
              <td>{{ drug.price }}</td>
              <td>
                <div class="flex gap-1">
                  <p class="">{{ drug.dosage }}</p>
                  <p class="">{{ drug.unit }}</p>
                </div>
              </td>
              <td class=" hidden sm:block">{{ drug.about }}</td>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'

const drugs = ref([]);
const isLoading = ref(true);
const router = useRouter();


const isImageModalOpen = ref(false);
const selectedImage = ref('');

const fetchDrugs = async () => {
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

async function deleteDrug(id: number) {
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
    console.error(error.message);
  }
}

const editDrug = (id: number) => {
  router.push(`/admin/drug/edit/${id}`);
};

// Modal handlers
const showImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

onMounted(async () => {
  await fetchDrugs()
})

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
