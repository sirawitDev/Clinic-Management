<template>
  <UserLayout>
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5">
      <ProfileAside />

      <div class="flex-1 p-5">
        <div class="font-bold text-3xl flex justify-center">ประวัติการรักษา</div>

        <div class="overflow-x-auto p-4">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <p class="text-center">รายชื่อ</p>
                </th>
                <th>
                  <p class="text-center">แพทย์ผู้รักษา</p>
                </th>
                <th>
                  <p class="text-center">วินิจฉัย</p>
                </th>
                <th>
                  <p class="text-center">การรักษา</p>
                </th>
                <th>
                  <p class="text-center">อื่นๆ</p>
                </th>
                <th>
                  <p class="text-center">เสร็จสิ้นวันที่</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="diagnosis in diagnoses" :key="diagnosis.id">
                <td>
                  <p class="text-center">{{ getPatientName(diagnosis.patient_id) }}</p>
                </td>
                <td>
                  <p class="text-center">{{ getPhysicianName(diagnosis.physician_id) }}</p>
                </td>
                <td>
                  <p class="text-center">{{ diagnosis.diagnosis }}</p>
                </td>
                <td>
                  <p class="text-center">{{ diagnosis.treatment_plan }}</p>
                </td>
                <td>
                  <p class="text-center">{{ diagnosis.notes }}</p>
                </td>
                <td>
                  <p class="text-center">{{ formatDate(diagnosis.createdAt) }}</p>
                </td>
                <td class="">
                  <div class="flex justify-center">
                    <div class="btn btn-accent font-light text-white">ดูเพิ่มเติม</div>
                  </div>
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
    console.log('Fetched diagnoses:', diagnoses.value);
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
  }
};



const fetchPatients = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    patients.value = await response.json();
    console.log('Fetched patients:', patients.value);
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

const fetchPhysicians = async () => {
  try {
    const response = await fetch('/api/physician', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch physicians');
    }

    physicians.value = await response.json();
    console.log('Fetched physicians:', physicians.value);
  } catch (error) {
    console.error('Error fetching physicians:', error);
  }
};

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
  await fetchPatients();
  await fetchPhysicians();
  await fetchDiagnosesByCdnumber()


  console.log('diagnoses : ', diagnoses.value)
  console.log('user : ', authStore.user)

});
</script>

<style scoped>

</style>
