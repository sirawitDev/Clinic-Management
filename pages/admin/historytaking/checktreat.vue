<template>
  <AdminLayout>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
      <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">ตรวจรักษา</h2>
    </div>
    <div class="max-w-4xl mx-auto bg-white rounded-md mt-5">
      <div class="grid sm:grid-cols-6 grid-cols-2 gap-2 p-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">น้ำหนัก(kg)</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/weight-scale_8730858-2.png">
              </div>
            </div>
          </div>
          <input v-model="weight" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">ส่วนสูง(cm)</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/height-scale_15756012.png" alt="">
              </div>
            </div>
          </div>
          <input v-model="height" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">อุณหภูมิ</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/hot-temperature_12284496.png" alt="">
              </div>
            </div>
          </div>
          <input v-model="temperature" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">ความดัน</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
              </div>
            </div>
          </div>
          <input v-model="bloodPressure" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">ชีพจร</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/cardiogram_3842142ae102ad4c0b815e.png" alt="">
              </div>
            </div>
          </div>
          <input v-model="pulse" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">การหายใจ</span>
              </div>
              <div class="ml-2">
                <img src="https://img2.pic.in.th/pic/respiratory_2790557.png" alt="">
              </div>
            </div>
          </div>
          <input v-model="respiration" type="number" placeholder=""
            class="input input-bordered input-accent w-full max-w-xs" />
        </label>
      </div>

      <div class="sm:flex flex-col">
        <div class="sm:flex-1 flex-col pl-4 pr-4">
          
          <label class="form-control">
            <div class="label">
              <div class="flex">
                <div class="mt-2">
                  <span class="label-text text-base">อาการ</span>
                </div>
                <div class="ml-2">
                  <img src="https://img5.pic.in.th/file/secure-sv1/dizziness_2853810.png" alt="">
                </div>
              </div>
            </div>
            <textarea v-model="symptoms" class="textarea textarea-accent textarea-bordered h-32"
              placeholder=""></textarea>
          </label>
        </div>

        <div class="sm:flex-1 flex pr-3 p-4">
          <label class="form-control w-full">
            <div class="label">
              <div class="flex">
                <div class="mt-2">
                  <span class="label-text text-base">ตรวจร่างกาย</span>
                </div>
                <div class="ml-2">
                  <img src="https://img5.pic.in.th/file/secure-sv1/report_6530077.png" alt="">
                </div>
              </div>
            </div>
            <textarea v-model="physicalExam" class="textarea textarea-accent textarea-bordered h-32"
              placeholder=""></textarea>
          </label>
        </div>
      </div>

      <div class="my-5 p-3">
        <button class="btn btn-accent w-full text-white font-light text-lg mb-2"
          @click="submitPatientHistory">ส่งตรวจ</button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatientHistoryStore } from '~/stores/patientHistory';
import AdminLayout from '~/layouts/adminLayout2.vue';

const store = usePatientHistoryStore();
const route = useRoute();
const router = useRouter();

const weight = ref<number | null>(null);
const height = ref<number | null>(null);
const temperature = ref<number | null>(null);
const bloodPressure = ref<number | null>(null);
const pulse = ref<number | null>(null);
const respiration = ref<number | null>(null);
const symptoms = ref('');
const physicalExam = ref('');

// Ensure valid patientId is extracted
const patientId = Number(route.query.id);
if (isNaN(patientId) || patientId <= 0) {
  console.error('Invalid patientId:', route.query.id);
  router.push('/admin/error'); // Handle error accordingly
}

const submitPatientHistory = async () => {
  try {
    const patientHistoryData = {
      patientId,
      weight: weight.value ?? 0,
      height: height.value ?? 0,
      temperature: temperature.value ?? 0,
      bloodPressure: bloodPressure.value ?? 0,
      pulse: pulse.value ?? 0,
      respiration: respiration.value ?? 0,
      symptoms: symptoms.value,
      physicalExam: physicalExam.value,
    };

    const createdPatientHistory = await store.submitPatientHistory(patientHistoryData);

    router.push(`/admin/historytaking/diagnosis?patientId=${patientId}&patientHistoryId=${createdPatientHistory.id}&historyComplete=true`);

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

onMounted(() => {
  console.log('Patient ID:', patientId);
});

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>