<template>
  <adminLayouts>
    <div class="mx-auto p-4">
      <div class="mb-4">
        <div
          class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลคอร์ส</h2>
        </div>
      </div>
      <form @submit.prevent="createCourse" class="space-y-4">
        <div>
          <label for="title" class="block text-lg font-medium">ชื่อคอร์ส</label>
          <input type="text" v-model="course.title" id="title" required class="mt-1 p-2 border rounded w-full" />
        </div>
        <div>
          <label for="description" class="block text-lg font-medium">คำอธิบาย</label>
          <textarea v-model="course.description" id="description" class="mt-1 p-2 border rounded w-full"></textarea>
        </div>
        <div>
          <label for="imageUrl" class="block text-lg font-medium">URL รูปภาพ</label>
          <input type="url" v-model="course.imageUrl" id="imageUrl" class="mt-1 p-2 border rounded w-full" />
        </div>
        <div>
          <label for="price" class="block text-lg font-medium">ราคา</label>
          <input type="number" v-model="course.price" id="price" required class="mt-1 p-2 border rounded w-full" />
        </div>
        <button type="submit" class="mt-4 bg-[#FF8128] text-white py-2 px-4 rounded-full">สร้างคอร์ส</button>
      </form>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from 'vue';
import adminLayouts from '~/layouts/adminLayout2.vue';

definePageMeta({
  middleware: 'auth',
});

// Define a ref to hold the course data
const course = ref({
  title: '',
  description: '',
  imageUrl: '',
  price: null,
});

const router = useRouter()

// Function to create a course
const createCourse = async () => {
  try {
    const response = await useFetch('/api/course', {
      method: 'POST',
      body: course.value,
    });

    if (response.ok) {
      console.log('Course created successfully:', response.data);
      alert('สร้างข้อมูลสำเร็จ')
      router.push('/admin/course')
    } else {
      // Handle errors
      console.error('Error creating course:', response.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
</script>

<style>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
