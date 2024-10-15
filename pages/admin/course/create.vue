<template>
  <adminLayouts>
    <div class="max-w-4xl mx-auto p-4">
      <div class="mb-4">
        <div
          class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลคอร์ส</h2>
        </div>
      </div>
      <form class="space-y-4">
        <div>
          <label for="title" class="block text-base font-medium">ชื่อคอร์ส</label>
          <input v-model="course.title" id="title" type="text" class="input input-bordered w-full" />
        </div>

        <div>
          <label for="description" class="block text-base font-medium">คำอธิบาย</label>
          <textarea v-model="course.description" id="description" class="mt-1 p-2 textarea textarea-bordered w-full"></textarea>
        </div>

        <div>
          <label for="imageUrl" class="block text-base font-medium">URL รูปภาพ</label>
          <input type="url" v-model="course.imageUrl" id="imageUrl" class="mt-1 p-2 input input-bordered w-full" />
        </div>
        <div>
          <label for="price" class="block text-base font-medium">ราคา</label>
          <input type="number" v-model="course.price" id="price" class="mt-1 p-2 input input-bordered w-full" />
        </div>

        <div class="flex justify-end gap-5 mt-5">
          <RouterLink to="/admin/course" class="w-60 btn btn-accent">
            <p class="text-white font-light">ย้อนกลับ</p>
          </RouterLink>
          <button @click.prevent="createCourse" class="btn btn-accent w-60 text-white font-light">สร้างคอร์ส</button>
        </div>
      </form>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';

definePageMeta({
  middleware: 'auth',
});

const course = ref({
  title: '',
  description: '',
  imageUrl: '',
  price: null,
});

const router = useRouter();

// Function to create a course
const createCourse = async () => {
  try {
    const response = await fetch('/api/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course.value),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating course:', error);
      alert('เกิดข้อผิดพลาดในการสร้างข้อมูลคอร์ส');
    } else {
      const data = await response.json();
      console.log('Course created successfully:', data);
      alert('สร้างข้อมูลสำเร็จ');
      router.push('/admin/course');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
  }
};

</script>

<style>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
