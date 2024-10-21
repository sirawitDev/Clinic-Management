<template>
  <adminLayouts class="bg-white w-full h-full p-5 shadow-md rounded-md mt-5">
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <span class="loading loading-spinner text-accent"></span>
    </div>

    <div v-else-if="course" class="bg-zinc-100 p-4 rounded-lg">
      <div class="bg-white rounded-lg p-4">
        <div class="flex justify-center">
          <div
            class="flex justify-center items-center bg-[#FF8128] w-[420px] h-20 shadow-md rounded-full mt-5 bg-opacity-50">
            <h2 class="sm:text-4xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">
              ข้อมูลคอร์ส</h2>
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <p class="text-xl font-bold text-gray-600">คอร์ส :</p>
          <h2 class="text-xl font-bold mb-3">{{ course.title }}</h2>
        </div>
        <img v-if="course.imageUrl" :src="course.imageUrl" alt="Course Image" class="w-full h-auto mb-3" />
        <div class="flex gap-2">
          <p class="text-xl font-bold text-gray-600">รายละเอียด :</p>
          <p class="text-lg mb-3"> {{ course.description || 'ยังไม่มีรายละเอียด' }}</p>
        </div>
        <div class="flex gap-2">
          <p class="text-xl font-semibold text-gray-600">ราคา : </p>
          <p class="text-lg">{{ course.price }} บาท</p>
        </div>
        <div class="text-md mt-2">
          <div class="flex">
            <p class="mt-2 font-bold text-xl text-gray-600">สถานะ : </p>
            <div :class="course.status === 'active' ? 'badge badge-success' : 'badge badge-error'"
              class="mt-2 mx-2 sm:h-7 h-5 w-20">
              <p class="text-white">{{ course.status }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- You can open the modal using ID.showModal() method -->
      <button class="btn btn-accent mt-3 w-full" onclick="my_modal_3.showModal()">
        <p class="text-white font-light">เพิ่มผู้ใช้บริการ</p>
      </button>

      <dialog id="my_modal_3" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div class="flex justify-center">
            <div
              class="flex justify-center items-center bg-[#FF8128] w-[420px] h-20 shadow-md rounded-full mt-5 bg-opacity-50">
              <h2 class="sm:text-4xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">
                เพิ่มผู้ใช้บริการ</h2>
            </div>
          </div>
          <label class="form-control w-full mt-2">
            <div class="label">
              <span class="label-text text-base">เลือกผู้ใช้บริการ</span>
            </div>
            <select class="select select-bordered" v-model="selectedPatientIds" multiple>
              <option v-for="(item, index) in userStore.users" :key="item.id" :value="item.id" class="my-1">
                {{ item.firstname }} {{ item.lastname }}
              </option>
            </select>
          </label>
          <div class="btn btn-accent w-full mt-3" @click="addPatientToCourse">
            <p class="text-white font-light">เพิ่มข้อมูล</p>
          </div>
        </div>
      </dialog>
      <div class="mt-3 flex flex-col justify-center bg-white rounded-md">
        <div class="flex justify-center">
          <div
            class="flex justify-center items-center bg-[#FF8128] w-[420px] h-20 shadow-md rounded-full mt-5 bg-opacity-50">
            <h2 class="sm:text-3xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">
              รายชื่อคนไข้ที่ใช้บริการคอร์ส</h2>
          </div>
        </div>
        <div class="overflow-x-auto mt-5">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อ</th>
                <th>เรื่มใช้บริการคอร์ส</th>
                <th>สถานะการใช้งานคอร์ส</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in getPatientDetails" :key="patient.id">
                <th>{{ patient.patientId }}</th>
                <td>{{ patient.userName }}</td> <!-- Show user name -->
                <td>{{ new Date(patient.addedAt).toLocaleDateString() || 'ยังไม่เริ่ม' }}</td>
                <td>{{ patient.status || 'ยังไม่มีสถานะ' }}</td>
                <td>
                  <button @click="removePatientFromCourse(patient.patientId)" class="btn btn-accent btn-base ml-2">
                    <p class="font-light text-white">ลบ</p>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-else>
      <p class="text-red-600">ไม่พบข้อมูลคอร์ส</p>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import adminLayouts from '~/layouts/adminLayout2.vue';
import { useUserStore } from '~/stores/user.ts'
import axios from 'axios'

const userStore = useUserStore()

const course = ref(null);
const isLoading = ref(true);
const error = ref(null);
const route = useRoute();
const selectedPatientIds = ref([])
const patients = ref([]);


const fetchCourse = async (id) => {
  isLoading.value = true;
  try {
    const response = await fetch(`/api/course/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    const data = await response.json();
    course.value = data.course;
    patients.value = course.value.patients; // Store patients
  } catch (err) {
    console.error('Error fetching course:', err);
    error.value = "Error fetching course.";
  } finally {
    isLoading.value = false;
  }
};

const addPatientToCourse = async () => {
  const courseId = route.params.id
  try {
    const response = await fetch('/api/admin/addPatientToCourse', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseId,
        patientIds: selectedPatientIds.value, // Send array of patient IDs
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('เพิ่มผู้ใช้สำเร็จ');
      selectedPatientIds.value = [];
    } else {
      window.location.reload()
    }
  } catch (error) {
    console.error('Error updating:', error);
    alert('An error occurred while updating');
  }
};

const removePatientFromCourse = async (patientId) => {
  const courseId = route.params.id; // Get the current course ID
  try {
    const response = await fetch('/api/admin/removePatientFromCourse', {
      method: 'DELETE', // Use DELETE method
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseId,
        patientId: patientId,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('ผู้ใช้บริการถูกลบออกจากคอร์สเรียบร้อยแล้ว');
      window.location.reload()
    } else {
      alert('ลบผู้ใช้บริการไม่สำเร็จ');
      console.log(data.message);
    }
  } catch (error) {
    console.error('Error removing patient:', error);
    alert('เกิดข้อผิดพลาดในการลบผู้ใช้บริการ');
  }
};


const getPatientDetails = computed(() => {
  return patients.value.map(patient => {
    const user = userStore.users.find(user => user.id === patient.patientId);
    return {
      ...patient,
      userName: user ? `${user.firstname} ${user.lastname}` : 'Unknown User', // Handle case if user not found
    };
  });
});
onMounted(async () => {
  const { id } = route.params;
  await fetchCourse(id);
  await userStore.fetchUsers()
});
</script>

<style scoped>
/* คุณสามารถปรับแต่งสไตล์ที่นี่ */
</style>
