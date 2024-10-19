<template>
  <adminLayouts>
    <div class="bg-white w-full h-full pl-5 pt-3 shadow-md rounded-md mt-5">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลคอร์ส</h2>
      </div>
      <div class="mb-5">
        <nuxt-link to="/admin/course/create"
          class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>

      <div class="overflow-x-auto">
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
                <p class="text-center">ชื่อคอร์ส</p>
              </th>
              <th>
                <p class="text-center">รูปภาพ</p>
              </th>
              <th>
                <p class="text-center">รายละเอียด</p>
              </th>
              <th>
                <p class="text-center">ราคา</p>
              </th>
              <th>
                <p class="text-center">สถานะ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in courses" :key="course.id">
              <th>
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td>
                <p class="text-center">{{ course.title }}</p>
              </td>
              <td>
                <img v-if="course.imageUrl" :src="course.imageUrl" alt="Promotion Image"
                  class="w-16 h-auto cursor-pointer" @click="openModal(promotion.imageUrl)" />
                <div v-else class="flex justify-center">
                  <p class=" text-gray-600">ไม่มีรูปภาพ</p>
                </div>
              </td>
              <td>
                <p v-if="course.description" class="text-center">{{ course.description }}</p>
                <p v-else class=" text-center">ยังไม่มีรายละเอียด</p>
              </td>
              <td>
                <p class="text-center">{{ course.price }} บาท</p>
              </td>
              <td>
                <p class="text-center">{{ course.status }}</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn sm:btn-md btn-sm" @click="deleteCourse(course.id)">
                    <Trash />
                  </button>
                  <!-- You can open the modal using ID.showModal() method -->
                  <RouterLink :to="`/admin/course/detail/${course.id}`" class="btn btn-accent">
                    <p class="font-light text-white">เพิ่มเติม</p>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal for Image Preview -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        @click="closeModal">
        <img :src="modalImage" alt="Expanded Course Image" class="max-w-full max-h-full cursor-auto"
          @click.stop="closeModal" />
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const courses = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const modalImage = ref('');
const router = useRouter();
const error = ref(null);

const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/course', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    courses.value = await response.json();
  } catch (err) {
    console.error('Error fetching courses:', err);
    error.value = "Error fetching courses.";
  } finally {
    isLoading.value = false;
  }
};

const deleteCourse = async (courseId) => {
  try {
    const response = await fetch(`/api/course`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: courseId }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
    await fetchCourses(); // Refresh the list after deletion
  } catch (err) {
    error.value = err.message;
  }
};

const openModal = (imageUrl) => {
  modalImage.value = imageUrl;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalImage.value = '';
};

onMounted(async () => {
  await fetchCourses()
  console.log('cou : ' , courses.value)
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

.table th {
  background-color: #f4f4f4;
  font-size: small;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
