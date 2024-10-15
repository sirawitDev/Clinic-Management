<template>
  <adminLayouts>
    <div class="bg-white w-full h-full p-5 shadow-md rounded-md mt-5">
      <h2 class="text-4xl font-bold text-[#FFD600]">แก้ไขข้อมูลโปรโมชั่น</h2>

      <form @submit.prevent="updatePromotion">
        <div class="mb-4">
          <label class="block text-gray-700" for="name">ชื่อโปรโมชั่น</label>
          <input v-model="promotion.name" type="text" id="name" class="input input-bordered w-full" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700" for="startDate">วันที่เริ่ม</label>
          <input v-model="promotion.startDate" type="date" id="startDate" class="input input-bordered w-full"
            required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700" for="endDate">วันที่สิ้นสุด</label>
          <input v-model="promotion.endDate" type="date" id="endDate" class="input input-bordered w-full" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700" for="imageUrl">URL รูปภาพ</label>
          <input v-model="promotion.imageUrl" type="text" id="imageUrl" class="input input-bordered w-full" required />
          <!-- Image Preview -->
          <div v-if="promotion.imageUrl" class="my-4">
            <div class="flex justify-center">
              <img :src="promotion.imageUrl" alt="Promotion Image" class="w-48 h-auto border rounded" />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700" for="status">สถานะ</label>
          <select v-model="promotion.status" id="status" class="select select-bordered w-full">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="flex justify-center gap-5">
          <RouterLink to="/admin/promotion" class="btn btn-accent text-white font-light w-60">
            ย้อนกลับ
          </RouterLink>
          <button type="submit" class="btn btn-accent text-white font-light w-60">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
    </div>
  </adminLayouts>
</template>

<script setup>
import adminLayouts from '~/layouts/adminLayout2.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const promotion = ref({
  id: '',
  name: '',
  startDate: '',
  endDate: '',
  imageUrl: '',
  status: 'active', // Default status
});

const router = useRouter();
const { id } = router.currentRoute.value.params;

const fetchPromotion = async () => {
  try {
    const response = await fetch(`/api/admin/promotion/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch promotion data');
    }
    const data = await response.json();
    promotion.value = {
      id: data.id,
      name: data.name,
      startDate: data.startDate.split('T')[0], // Format date for input[type="date"]
      endDate: data.endDate.split('T')[0],   // Format date for input[type="date"]
      imageUrl: data.imageUrl,
      status: data.status,
    };
  } catch (err) {
    console.error('Error fetching promotion:', err);
  }
};

const updatePromotion = async () => {
  try {
    const response = await fetch(`/api/admin/promotion/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promotion.value),
    });
    if (!response.ok) {
      throw new Error('Failed to update promotion');
    }
    await router.push('/admin/promotion');
  } catch (err) {
    console.error('Error updating promotion:', err);
  }
};

onMounted(async () => {
  await fetchPromotion()
  console.log('promotion : ', promotion.value)
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
