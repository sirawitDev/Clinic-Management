<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="mb-4">
        <div
          class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลคอร์ส</h2>
        </div>
      </div>
      <form class="space-y-4 bg-white rounded-md p-4 mt-5">
        <div>
          <label for="title" class="block text-base font-medium">ชื่อคอร์ส</label>
          <input v-model="course.title" id="title" type="text" class="input input-bordered w-full" />
        </div>

        <div>
          <label for="description" class="block text-base font-medium">คำอธิบาย</label>
          <textarea v-model="course.description" id="description" class="mt-1 p-2 textarea textarea-bordered w-full"></textarea>
        </div>

        <!-- <div>
          <label for="imageUrl" class="block text-base font-medium">URL รูปภาพ</label>
          <input type="url" v-model="course.imageUrl" id="imageUrl" class="mt-1 p-2 input input-bordered w-full" />
        </div> -->

        <div>
          <label for="imageFile" class="block text-base font-medium">อัปโหลดรูปภาพ</label>
          <input type="file" id="imageFile" @change="handleFileUpload" class=" file-input mt-1 input-bordered w-full" />
        </div>


        <div>
          <label for="price" class="block text-base font-medium">ราคา</label>
          <input type="number" v-model="course.price" id="price" class="mt-1 p-2 input input-bordered w-full" />
        </div>

        <div class="flex justify-end gap-5 mt-5">
          <RouterLink to="/admin/course" class="w-60 btn btn-accent">
            <p class="text-white font-light text-base">ย้อนกลับ</p>
          </RouterLink>
          <button @click.prevent="createCourse" class="btn btn-accent w-60 text-white font-light text-base">สร้างคอร์ส</button>
        </div>
      </form>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Swal from 'sweetalert2';

definePageMeta({
  middleware: 'auth',
});

const course = ref({
  title: '',
  description: '',
  price: null,
});

const imageFile = ref(null);

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0];
};

const router = useRouter();

const createCourse = async () => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการสร้างคอร์สนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, สร้างเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const formData = new FormData();
      formData.append('title', course.value.title);
      formData.append('description', course.value.description);
      formData.append('price', course.value.price);
      if (imageFile.value) {
        formData.append('image', imageFile.value);
      }

      const response = await fetch('/api/admin/course', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating course:', error);
        // ใช้ SweetAlert2 แสดงข้อผิดพลาด
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการสร้างข้อมูลคอร์ส',
        });
      } else {
        const data = await response.json();
        await Swal.fire({
          icon: 'success',
          title: 'สร้างข้อมูลสำเร็จ',
          text: 'คอร์สถูกสร้างเรียบร้อยแล้ว',
        });
        router.push('/admin/course');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
      });
    }
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>

<style>
.container {
  max-width: 600px;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
