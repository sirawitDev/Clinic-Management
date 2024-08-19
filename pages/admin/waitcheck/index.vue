<template>
  <AdminLayout>
    <div class="mx-auto h-full p-4">
      <div class="flex p-4 justify-center items-center bg-white rounded-full mt-3 shadow-md">
        <div class="flex w-full flex-col">
          <div class="divider divider-accent">
            <p class="text-4xl">รอตรวจ</p>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in patientHistories" :key="item.id"
        class="grid grid-cols-2 gap-4 mt-5 bg-white rounded-md font-sarabun">
        <div class="shadow-md border-black rounded-md p-4 flex flex-col h-60 font-sarabun bg-orange-200 mx-5 my-5">
          <div class="flex">
            <div class="flex items-start ">
              <div class="avatar">
                <div class="w-32 h-32 rounded bg-white p-4">
                  <img src="https://img2.pic.in.th/pic/users_391194.png" />
                </div>
              </div>
            </div>
            <div class="pt-2 flex flex-col justify-between w-full">
              <div class="flex w-full">
                <div class="text-lg w-full ml-5">
                  <p><strong>ชื่อ:</strong> {{ item.patient ? item.patient.firstname : 'ไม่ระบุ' }}</p>
                  <p class="pt-2"><strong>อาการ:</strong> {{ item.chiefComplaint }}</p>
                  <p class="pt-2"><strong>อาการสำคัญ:</strong> <span class="whitespace-normal">{{ item.symptoms
                      }}</span></p>
                </div>
                <div class="text-lg w-full flex flex-col">
                  <p><strong>นามสกุล:</strong> {{ item.patient ? item.patient.lastname : 'ไม่ระบุ' }}</p>
                  <p class="pt-2"><strong>สถานะ:</strong> {{ item.status }}</p>
                </div>
              </div>
              <div class="flex gap-1 my-5">
                <div class="flex-1 flex justify-end">
                  <button class="btn btn-accent text-white font-thin w-full" @click="handleCheck(item.patient.id, item.id)">
                    ตรวจ
                  </button>
                </div>
                <div class="flex-1 ">
                  <button class="btn btn-error text-white font-thin w-full" @click="handleDelete(item.id)">
                    ลบ
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
import AdminLayout from '~/layouts/adminLayouts.vue';

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
</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}

.whitespace-normal {
  white-space: nowrap;
}
</style>