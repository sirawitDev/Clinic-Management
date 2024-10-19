<template>
  <AdminLayout>
    <div class="mx-auto h-full p-4">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">รอตรวจ</h2>
      </div>

      <div class="grid sm:grid-cols-2 grid-cols-1 mt-5 rounded-md font-sarabun bg-base-200">
        <div v-for="(item, index) in patientHistories" :key="item.id"
          class="shadow-lg border-black rounded-md p-4 flex flex-col sm:h-64 h-48 font-sarabun bg-white mx-5 my-5">
          <div class="flex">
            <div class="flex items-start hidden sm:block ">
              <div class="avatar">
                <div class="w-32 h-32 rounded bg-white p-4">
                  <img src="https://img2.pic.in.th/pic/users_391194.png" />
                </div>
              </div>
            </div>
            <div class="pt-2 flex flex-col justify-between w-full">
              <div class="flex w-full">
                <div class="text-lg w-full ml-5 sm:text-base text-sm">
                  <p><strong>ชื่อ:</strong> {{ item.patient ? item.patient.firstname : 'ไม่ระบุ' }}</p>
                  <p class="pt-2"><strong>อาการ:</strong> {{ item.chiefComplaint }}</p>
                  <p class="pt-2"><strong>อาการสำคัญ:</strong> <span class="whitespace-normal">{{ item.symptoms
                      }}</span></p>
                </div>
                <div class="text-sm w-full flex flex-col sm:text-base mx-3">
                  <p><strong>นามสกุล:</strong> {{ item.patient ? item.patient.lastname : 'ไม่ระบุ' }}</p>
                  <p class="pt-2" v-if="item.status === 'close'"><strong>สถานะ:</strong>รอตรวจ</p>
                </div>
              </div>
              <div class="flex gap-1 my-5">
                <div class="flex-1 flex justify-end">
                  <button class="btn btn-error text-white font-thin w-full" @click="handleDelete(item.id)">
                    ลบ
                  </button>
                </div>
                <div class="flex-1 ">
                  <button class="btn btn-accent text-white font-thin w-full"
                    @click="handleCheck(item.patient.id, item.id)">
                    ตรวจ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

const patientHistories = ref([]);
const router = useRouter();

async function fetchPatientHistories() {
  try {
    const response = await fetch('/api/fetch-patient-histories');
    const data = await response.json();
    if (response.ok) {
      patientHistories.value = data.filter(item => item.status === 'close');
    } else {
      console.error('Error fetching data:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

async function handleDelete(id) {
  try {
    const response = await fetch('/api/delete-patient-history', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (response.ok) {
      patientHistories.value = patientHistories.value.filter(item => item.id !== id);
    } else {
      console.error('Error deleting data:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

function handleCheck(patientId, patientHistoryId) {
  router.push({
    path: '/admin/historytaking/diagnosis',
    query: {
      patientId: patientId.toString(),
      patientHistoryId: patientHistoryId.toString(),
      historyComplete: 'true',
    },
  });
}

onMounted(() => {
  fetchPatientHistories();
});

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}

.whitespace-normal {
  white-space: nowrap;
}
</style>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>