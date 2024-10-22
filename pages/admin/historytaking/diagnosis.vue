<template>
  <AdminLayout>
    <!-- Header -->
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
      <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">วินิฉัย</h2>
    </div>
    <div class="container mx-auto max-w-5xl bg-white p-4 mt-5">

      <!-- Diagnosis Select -->
      <label class="form-control w-full mt-5">
        <div class="label">
          <div class="flex">
            <div class="mt-2">
              <span class="label-text text-lg">วินิจฉัย 1</span>
            </div>
            <div class="ml-2">
              <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
            </div>
          </div>
        </div>
        <select v-model="diagnosis" @change="checkOtherDiagnosis" class="select select-accent select-bordered w-full">
          <option disabled value="" selected>-- เลือกวินิจฉัย --</option>
          <option v-for="diag in diagnosisOptions" :key="diag" :value="diag">
            {{ diag }}
          </option>
        </select>
        <div v-if="isOtherDiagnosis" class="mt-2">
          <input v-model="customDiagnosis" type="text" placeholder="ระบุวินิจฉัยอื่นๆ"
            class="input input-accent input-bordered w-full" />
        </div>
      </label>

      <!-- Treatment Plan Select -->
      <label class="form-control w-full mt-5">
        <div class="label">
          <div class="flex">
            <div class="mt-2">
              <span class="label-text text-lg">แผนการรักษา</span>
            </div>
            <div class="ml-2">
              <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
            </div>
          </div>
        </div>
        <select v-model="treatmentPlan" @change="checkOtherTreatmentPlan"
          class="select select-accent select-bordered w-full">
          <option disabled value="" selected>-- เลือกแผนการรักษา --</option>
          <option v-for="plan in treatmentPlanOptions" :key="plan" :value="plan">
            {{ plan }}
          </option>
        </select>
        <div v-if="isOtherTreatmentPlan" class="mt-2">
          <input v-model="customTreatmentPlan" type="text" placeholder="ระบุแผนการรักษาอื่นๆ"
            class="input input-accent input-bordered w-full" />
        </div>
      </label>

      <!-- Notes (ระยะการทานยา) -->
      <label class="form-control w-full max-w-xs mt-3">
        <div class="label">
          <div class="flex">
            <div class="mt-2">
              <span class="label-text text-lg">ระยะการทานยา</span>
            </div>
            <div class="ml-2">
              <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
            </div>
          </div>
        </div>
        <select class="select select-bordered" v-model="notes" @change="checkOtherPeriod">
          <option disabled value="" selected>-- ระยะการทานยา --</option>
          <option v-for="period in periods" :key="period.id" :value="period.title">
            {{ period.title }}
          </option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        <div v-if="isOtherPeriod" class="mt-2">
          <input v-model="customPeriod" type="text" placeholder="ระบุระยะการทานยาอื่นๆ"
            class="input input-accent input-bordered w-full" />
        </div>
      </label>

      <!-- Physician Select -->
      <label class="form-control w-full">
        <div class="label">
          <div class="flex">
            <div class="mt-2">
              <span class="label-text text-lg">เลือกแพทย์ผู้รักษา</span>
            </div>
            <div class="ml-2">
              <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
            </div>
          </div>
        </div>
        <select v-model="physicianId" class="select text-base select-accent select-bordered">
          <option disabled value="" selected>-- เลือกแพทย์ --</option>
          <option v-for="physician in physicians" :key="physician.id" :value="physician.id">
            {{ physician.title }} {{ physician.first_name }} {{ physician.last_name }}
          </option>
        </select>
      </label>

      <!-- Submit Button -->
      <div>
        <button @click="submitDiagnosis"
          class="btn btn-accent mt-5 w-full font-light text-white text-lg">ส่งวินิจฉัย</button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiagnosisStore } from '~/stores/useDiagnosisStore'
import AdminLayout from '~/layouts/adminLayout2.vue'

const route = useRoute()
const router = useRouter()
const store = useDiagnosisStore()

// Diagnosis options
const diagnosisOptions = ref([
  'โรคไข้หวัด',
  'ปวดศีรษะ',
  'โรคความดันโลหิตสูง',
  'เบาหวาน',
  'อื่นๆ'
])

// Treatment plan options
const treatmentPlanOptions = ref([
  'ให้ยาพาราเซตามอล',
  'ให้ยาแก้ปวด',
  'ปรับเปลี่ยนการดำเนินชีวิต',
  'ส่งต่อผู้เชี่ยวชาญ',
  'อื่นๆ'
])

// Reactive state
const diagnosis = ref('')
const treatmentPlan = ref('')
const notes = ref('')
const customPeriod = ref('')
const physicianId = ref<number | null>(null)
const physicians = ref([])

// New reactive variables for custom inputs
const isOtherDiagnosis = ref(false)
const isOtherTreatmentPlan = ref(false)
const isOtherPeriod = ref(false)
const customDiagnosis = ref('')
const customTreatmentPlan = ref('')
const periods = ref([])

const fetchPeriods = async () => {
  try {
    const response = await fetch('/api/periodOfdrug', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    periods.value = await response.json();
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

// Fetch physicians list
const fetchPhysicians = async () => {
  try {
    const response = await fetch('/api/physician', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    physicians.value = await response.json();
  } catch (error) {
    console.error('Error fetching physicians:', error);
  }
};

// Get patientId and patientHistoryId from route query
const patientId = Number(route.query.patientId)
const patientHistoryId = Number(route.query.patientHistoryId)


// Function to check if "อื่นๆ" is selected for diagnosis
const checkOtherDiagnosis = () => {
  isOtherDiagnosis.value = diagnosis.value === 'อื่นๆ';
}

// Function to check if "อื่นๆ" is selected for treatment plan
const checkOtherTreatmentPlan = () => {
  isOtherTreatmentPlan.value = treatmentPlan.value === 'อื่นๆ';
}

// Function to check if "อื่นๆ" is selected for period
const checkOtherPeriod = () => {
  isOtherPeriod.value = notes.value === 'อื่นๆ';
}

// Handle diagnosis submission
const submitDiagnosis = async () => {
  const finalDiagnosis = isOtherDiagnosis.value ? customDiagnosis.value : diagnosis.value;
  const finalTreatmentPlan = isOtherTreatmentPlan.value ? customTreatmentPlan.value : treatmentPlan.value;
  const finalPeriod = isOtherPeriod.value ? customPeriod.value : notes.value;

  if (!finalDiagnosis || !finalTreatmentPlan || !finalPeriod || physicianId.value === null) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  try {
    const response = await fetch('/api/diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: patientId,
        patientHistoryId,
        diagnosis: finalDiagnosis,
        treatment_plan: finalTreatmentPlan,
        notes: finalPeriod,
        physician_id: physicianId.value,
        paymentStatus: 'pening',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit diagnosis');
    }

    const updateResponse = await fetch(`/api/update-patient-history-status/${patientHistoryId}`, {
      method: 'PATCH',
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update patient history status');
    }

    alert('บันทึกวินิจฉัยสำเร็จ');

    if (!updateResponse.ok) {
      throw new Error('Failed to update patient history');
    }

    router.push('/admin/checksuccess');
  } catch (error) {
    console.error('Error submitting diagnosis:', error);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
  }
}

onMounted(async () => {
await fetchPeriods()
await fetchPhysicians()
})

definePageMeta({
  middleware: 'auth',
});
</script>
