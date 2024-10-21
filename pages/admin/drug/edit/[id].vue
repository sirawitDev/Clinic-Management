<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">แก้ไขข้อมูลยา</h2>
      </div>

      <div class="mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <p class="text-xl font-semibold">Loading...</p>
        </div>

        <!-- Display form once data is fetched -->
        <form v-else @submit.prevent="updateDrug">
          <div class="mb-5">
            <label class="label">ชื่อยา</label>
            <input v-model="drug.name" type="text" class="input input-bordered w-full" />
          </div>

          <div>
            <label class="block text-base font-medium">URL รูปภาพ</label>
            <input v-model="drug.imageUrl" id="imageUrl" type="text" class="input input-bordered w-full" />
          </div>

          <!-- Image Preview -->
          <div v-if="drug.imageUrl" class="my-4">
            <div class="flex justify-center">
              <img :src="drug.imageUrl" alt="" class="w-48 h-auto border rounded" />
            </div>
          </div>

          <div class="mb-5">
            <label class="label">ประเภท</label>
            <input v-model="drug.type" type="text" class="input input-bordered w-full" />
          </div>

          <div class="mb-5">
            <label class="label">ราคา</label>
            <input v-model="drug.price" type="number" class="input input-bordered w-full" />
          </div>

          <div class="mb-5">
            <label class="label">ปริมาณ</label>
            <input v-model="drug.dosage" type="text" class="input input-bordered w-full" />
          </div>

          <div class="mb-5">
            <label class="label">หน่วย</label>
            <input v-model="drug.unit" type="text" class="input input-bordered w-full" />
          </div>

          <div class="mb-5">
            <label class="label">ข้อมูลเพิ่มเติม</label>
            <textarea v-model="drug.about" class="textarea textarea-bordered w-full"></textarea>
          </div>

          <div class="flex justify-end gap-5">
            <RouterLink to="/admin/drug" class="btn btn-accent w-60 mt-5">
              <p class="font-light text-white">ย้อนกลับ</p>
            </RouterLink>
            <button class="btn btn-accent w-60 text-white font-light mt-5" type="submit">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';

const drug = ref({
  name: '',
  imageUrl: '',
  type: '',
  price: 0,
  dosage: '',
  unit: '',
  about: '',
});

const isLoading = ref(true);
const router = useRouter();
const route = useRoute();

const fetchDrug = async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`/api/drug/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching drug details');
    }
    drug.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const updateDrug = async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`/api/drug/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drug.value),
    });
    if (!response.ok) {
      throw new Error('Error updating drug');
    }
    await response.json();
    router.push('/admin/drug');
  } catch (error) {
    console.error(error.message);
  }
};

onMounted(async() => {
  await fetchDrug()
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
