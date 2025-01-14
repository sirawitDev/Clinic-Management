<template>
  <UserLayout>
    <div class="sm:hidden">
      <details class="dropdown">
        <summary class="btn btn-accent m-1">
          <p class="text-white">เมนูการตั้งค่า</p>
        </summary>
        <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li>
            <RouterLink to="/user/profile"
              class="btn sm:btn-base btn-sm btn-accent w-full rounded-full text-white font-light mt-2">
              ตั้งค่าโปรไฟล์</RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/addresses"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ข้อมูลที่อยู่
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/medicalhistory"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ประวัติการรักษา
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/bookinghistory"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ประวัติการจอง
            </RouterLink>
          </li>
          <li>
            <div @click="authStore.logout()" class="btn bg-red-500 sm:btn-base btn-sm rounded-full text-white font-light mt-2">ออกจากระบบ</div>
          </li>
        </ul>
      </details>
    </div>
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5 w-full">
      <ProfileAside class="hidden sm:block" />

      <div class="flex-1 p-5 w-full font-kanit">
        <div class="flex justify-center">
          <div
            class="flex justify-center items-center bg-[#FF8128] sm:w-[60%] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
            <h2 class="sm:text-4xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">ประวัติการรักษา</h2>
          </div>
        </div>

        <div class="overflow-x-auto p-4 mt-2">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <p class="text-center text-base">รายชื่อ</p>
                </th>
                <th>
                  <p class="text-center text-base">แพทย์ผู้รักษา</p>
                </th>
                <th>
                  <p class="text-center text-base">วินิจฉัย</p>
                </th>
                <th>
                  <p class="text-center text-base">การรักษา</p>
                </th>
                <th>
                  <p class="text-center text-base">อื่นๆ</p>
                </th>
                <th>
                  <p class="text-center text-base">เสร็จสิ้นวันที่</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="diagnosis in diagnoses" :key="diagnosis.id">
                <td>
                  <p class="text-center sm:text-base text-sm">{{ getPatientName(diagnosis.patient_id) }}</p>
                </td>
                <td>
                  <p class="text-center sm:text-base text-sm">{{ getPhysicianName(diagnosis.physician_id) }}</p>
                </td>
                <td>
                  <p class="text-center sm:text-base text-sm">{{ diagnosis.diagnosis }}</p>
                </td>
                <td>
                  <p class="text-center sm:text-base text-sm">{{ diagnosis.treatment_plan }}</p>
                </td>
                <td>
                  <p class="text-center sm:text-base text-sm">{{ diagnosis.notes }}</p>
                </td>
                <td>
                  <p class="text-center sm:text-base text-sm">{{ formatDate(diagnosis.createdAt) }}</p>
                </td>
                <td class="">
                  <!-- <div class="flex justify-center">
                    <div class="btn btn-accent font-light text-white">ดูเพิ่มเติม</div>
                  </div> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProfileAside from '~/components/user/ProfileAside.vue';
import UserLayout from '~/layouts/userLayouts.vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore()

const diagnoses = ref([]);
const patients = ref([]);
const physicians = ref([]);

const searchCdnumber = ref('');
const filteredDiagnoses = ref([]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const fetchDiagnosesByCdnumber = async () => {
  try {
    const cdnumber = authStore.user.cdnumber;

    const response = await fetch(`/api/users/getDiagnosesByCdnumber?cdnumber=${cdnumber}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch diagnoses');
    }

    diagnoses.value = await response.json();
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
  }
};

// const fetchPatients = async () => {
//   try {
//     const response = await fetch('/api/user', {
//       method: 'GET',
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch patients');
//     }

//     patients.value = await response.json();
//     console.log('Fetched patients:', patients.value);
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//   }
// };

// const fetchPhysicians = async () => {
//   try {
//     const response = await fetch('/api/physician', {
//       method: 'GET',
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch physicians');
//     }

//     physicians.value = await response.json();
//   } catch (error) {
//     console.error('Error fetching physicians:', error);
//   }
// };

const getPatientName = (id) => {
  const patient = patients.value.find(patient => patient.id === id);
  return patient ? `${patient.firstname} ${patient.lastname}` : 'Unknown Patient';
};

const getPhysicianName = (id) => {
  const physician = physicians.value.find(physician => physician.id === id);
  return physician ? `${physician.first_name} ${physician.last_name}` : 'Unknown Physician';
};


authStore.initializeAuth()

onMounted(async () => {
  // await fetchPatients();
  // await fetchPhysicians();
  await fetchDiagnosesByCdnumber()
});

</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
