<template>
  <adminLayouts>
    <div class="mx-auto p-4">
      <div class="mb-4">
        <div class="flex">
          <div class="flex-1 mt-4">
            <div class="divider"></div>
          </div>
          <div class="flex-2">
            <h1 class="font-bold text-3xl p-4">เพิ่มข้อมูลโปรโมชั่น</h1>
          </div>
          <div class="flex-1 mt-4">
            <div class="divider"></div>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto">
        <!-- Promotion Name -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">ชื่อโปรโมชั่น</span>
          </div>
          <input v-model="name" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Image URL -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">รูปภาพ URL</span>
          </div>
          <input v-model="imageUrl" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Image Preview -->
        <div v-if="imageUrl" class="my-4">
          <div class="flex justify-center">
            <img :src="imageUrl" alt="Promotion Image" class="w-48 h-auto border rounded" />
          </div>
        </div>

        <!-- About Description -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">คำอธิบายรายละเอียดสินค้า</span>
          </div>
          <input v-model="about" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Start Date and Time -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">วันที่เริ่มต้นและเวลา</span>
          </div>
          <input v-model="startDateTime" type="datetime-local" class="input input-bordered w-full" />
        </label>

        <!-- End Date and Time -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">วันที่สิ้นสุดและเวลา</span>
          </div>
          <input v-model="endDateTime" type="datetime-local" class="input input-bordered w-full" />
        </label>

        <!-- Submit Button -->
        <div class="flex justify-end gap-5">

          <RouterLink to="/admin/promotion" class="btn btn-accent mt-4 font-light text-white">ย้อนกลับ</RouterLink>
          <button @click="submitForm" class="btn btn-primary mt-4 font-light text-white">เพิ่มโปรโมชั่น</button>

        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import adminLayouts from '~/layouts/adminLayout2.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const imageUrl = ref('');
const about = ref('');
const startDateTime = ref(''); // Updated to handle date and time
const endDateTime = ref(''); // Updated to handle date and time

const router = useRouter();
const submitForm = async () => {
  try {
    const response = await $fetch('/api/promotions', {
      method: 'POST',
      body: {
        name: name.value,
        imageUrl: imageUrl.value,
        about: about.value,
        startDate: new Date(startDateTime.value), // Updated to use datetime
        endDate: new Date(endDateTime.value), // Updated to use datetime
        status: 'active',
      }
    });

    console.log('Response:', response); // Debugging log

    if (response.success) {
      alert('Promotion added successfully');
      router.push('/admin/promotion');
    } else {
      router.push('/admin/promotion');
    }
  } catch (error) {
    console.error('Error adding promotion:', error);
    alert('An error occurred while adding the promotion: ' + error.message);
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>
