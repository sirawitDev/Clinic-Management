<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลโปรโมชั่น</h2>
      </div>

      <div class="bg-white rounded-md p-4 mt-5">
        <!-- Promotion Name -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">ชื่อโปรโมชั่น</span>
          </div>
          <input v-model="name" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- File Upload -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">รูปภาพ</span>
          </div>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept="image/*"
            class="file-input file-input-bordered w-full" 
          />
        </label>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="my-4">
          <div class="flex justify-center">
            <img :src="imagePreview" alt="Promotion Image Preview" class="w-48 h-auto border rounded" />
          </div>
        </div>

        <!-- About Description -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">คำอธิบายรายละเอียดสินค้า</span>
          </div>
          <input v-model="about" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Start Date and Time -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">วันที่เริ่มต้นและเวลา</span>
          </div>
          <input v-model="startDateTime" type="date" class="input input-bordered w-full" />
        </label>

        <!-- End Date and Time -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">วันที่สิ้นสุดและเวลา</span>
          </div>
          <input v-model="endDateTime" type="date" class="input input-bordered w-full" />
        </label>

        <!-- Submit Button -->
        <div class="flex justify-end gap-5">
          <RouterLink to="/admin/promotion" class="btn btn-accent mt-4 font-light text-base text-white">ย้อนกลับ</RouterLink>
          <button @click="submitForm" class="btn btn-primary mt-4 font-light text-base text-white">เพิ่มโปรโมชั่น</button>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import adminLayouts from '~/layouts/adminLayout2.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const name = ref('');
const imageFile = ref(null);
const imagePreview = ref('');
const about = ref('');
const startDateTime = ref('');
const endDateTime = ref('');

const router = useRouter();

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'ยืนยันการเพิ่มโปรโมชั่น',
    text: 'คุณต้องการเพิ่มโปรโมชั่นนี้หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (!isConfirmed) return;

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('image', imageFile.value);
    formData.append('about', about.value);
    formData.append('startDate', new Date(startDateTime.value).toISOString());
    formData.append('endDate', new Date(endDateTime.value).toISOString());
    formData.append('status', 'active');

    const response = await $fetch('/api/promotions', {
      method: 'POST',
      body: formData
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มโปรโมชั่นสำเร็จ',
      text: 'โปรโมชั่นได้ถูกเพิ่มแล้ว',
    });

    router.push('/admin/promotion');
  } catch (error) {
    console.error('Error adding promotion:', error);

    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น: ' + error.message,
    });
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.container {
  max-width: 600px;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>