<template>
  <AdminLayout>
    <div class="flex bg-white rounded-full mt-3 shadow-md">
      <div class="flex-1 mt-4 pl-3">
        <div class="divider divider-accent"></div>
      </div>
      <div class="flex-2">
        <h1 class="font-light text-4xl p-4">ตรวจรักษา</h1>
      </div>
      <div class="flex-1 mt-4 pr-4">
        <div class="divider divider-accent"></div>
      </div>
    </div>
    <div class="grid grid-cols-6 gap-2 p-3">
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
        <input v-model="weight" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
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
        <input v-model="height" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
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
        <input v-model="temperature" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
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
        <input v-model="bloodPressure" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
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
        <input v-model="pulse" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
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
        <input v-model="respiration" type="number" placeholder="" class="input input-bordered input-accent w-full max-w-xs" />
      </label>
    </div>

    <div class="flex">
      <div class="flex-1 pl-4 pr-4">
        <label class="form-control">
          <div class="label">
            <div class="flex">
              <div class="mt-2">
                <span class="label-text text-base">อาการสำคัญ </span>
              </div>
              <div class="ml-2">
                <img src="https://img5.pic.in.th/file/secure-sv1/sick_8004107.png" alt="">
              </div>
            </div>
          </div>
          <textarea v-model="chiefComplaint" class="textarea textarea-accent textarea-bordered h-24" placeholder=""></textarea>
        </label>
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
          <textarea v-model="symptoms" class="textarea textarea-accent textarea-bordered h-32" placeholder=""></textarea>
        </label>
      </div>
      <div class="flex-1 pr-3">
        <label class="form-control">
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
          <textarea v-model="physicalExam" class="textarea textarea-accent textarea-bordered h-[265px]" placeholder=""></textarea>
        </label>
      </div>
    </div>

    <div class="flex justify-end pt-5 pr-3 pl-3">
      <button class="btn btn-accent w-full text-white font-light text-lg" @click="submitPatientHistory">ส่งตรวจ</button>
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
const chiefComplaint = ref('');
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
      chiefComplaint: chiefComplaint.value,
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
</script>