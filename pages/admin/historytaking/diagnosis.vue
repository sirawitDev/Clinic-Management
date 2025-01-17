<template>
  <AdminLayout>
    <!-- Header -->
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
      <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">วินิจฉัย</h2>
    </div>
    <div class="container mx-auto max-w-5xl bg-white p-4 mt-5">

      <label class="form-control w-full mt-5">
        <div class="label">
          <div class="flex">
            <div class="mt-2">
              <span class="label-text text-lg">วินิจฉัย</span>
            </div>
            <div class="ml-2">
              <img src="https://img2.pic.in.th/pic/arm_2855503.png" alt="">
            </div>
          </div>
        </div>
        <select v-model="diagnosis" @change="checkOtherDiagnosis" class="select select-accent select-bordered w-full">
          <option disabled value="" selected>-- เลือกวินิจฉัย --</option>
          <option v-for="diag in infodiagnosises" :key="diag.id" :value="diag.title">
            {{ diag.title }}
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
          <option v-for="plan in infotreatments" :key="plan.id" :value="plan.title">
            {{ plan.title }}
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiagnosisStore } from '~/stores/useDiagnosisStore'
import AdminLayout from '~/layouts/adminLayout2.vue'
import Swal from 'sweetalert2';
import axios from 'axios';

const route = useRoute()
const router = useRouter()
const store = useDiagnosisStore()

const url = new URL(window.location.href);



const diagnosisOptions = ref([
  'โรคไข้หวัด',
  'ปวดศีรษะ',
  'โรคความดันโลหิตสูง',
  'เบาหวาน',
  'อื่นๆ'
])


const treatmentPlanOptions = ref([
  'ให้ยาพาราเซตามอล',
  'ให้ยาแก้ปวด',
  'ปรับเปลี่ยนการดำเนินชีวิต',
  'ส่งต่อผู้เชี่ยวชาญ',
  'อื่นๆ'
])

const diagnosis = ref('')
const users = ref([])
const treatmentPlan = ref('')
const notes = ref('')
const customPeriod = ref('')
const physicianId = ref(null)
const physicians = ref([])
const infotreatments = ref([])

const infodiagnosises = ref([])

const isOtherDiagnosis = ref(false)
const isOtherTreatmentPlan = ref(false)
const isOtherPeriod = ref(false)
const customDiagnosis = ref('')
const customTreatmentPlan = ref('')
const periods = ref([])

const patientId = Number(route.query.patientId)
const patientHistoryId = Number(route.query.patientHistoryId)

const fetchUsers = async () => {
  try {
    const response = await axios.get(`/api/patients/${patientId}`)
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

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

const fetchinfoTreatment = async () => {
  try {
    const response = await fetch('/api/infotreatment', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    infotreatments.value = await response.json();
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

const fetchinfoDiagnosis = async () => {
  try {
    const response = await fetch('/api/infodiagnosis', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    infodiagnosises.value = await response.json();
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

const checkOtherDiagnosis = () => {
  isOtherDiagnosis.value = diagnosis.value === 'อื่นๆ';
}

const checkOtherTreatmentPlan = () => {
  isOtherTreatmentPlan.value = treatmentPlan.value === 'อื่นๆ';
}

const checkOtherPeriod = () => {
  isOtherPeriod.value = notes.value === 'อื่นๆ';
};

const submitDiagnosis = async () => {
  const finalDiagnosis = isOtherDiagnosis.value ? customDiagnosis.value : diagnosis.value;
  const finalTreatmentPlan = isOtherTreatmentPlan.value ? customTreatmentPlan.value : treatmentPlan.value;
  const finalPeriod = isOtherPeriod.value ? customPeriod.value : notes.value;

  if (!finalDiagnosis || !finalTreatmentPlan || !finalPeriod || physicianId.value === null) {
    await Swal.fire({
      icon: 'error',
      title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      text: 'กรุณากรอกข้อมูลให้ครบทุกช่องก่อนส่ง',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการบันทึกข้อมูลการวินิจฉัยนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, บันทึกเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          patient_cdnumber: users.value.cdnumber,
          patientHistoryId,
          diagnosis: finalDiagnosis,
          treatment_plan: finalTreatmentPlan,
          notes: finalPeriod,
          physician_id: parseInt(physicianId.value),
          paymentStatus: 'pending',
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

      await Swal.fire({
        icon: 'success',
        title: 'บันทึกวินิจฉัยสำเร็จ!',
        text: 'ข้อมูลการวินิจฉัยได้ถูกบันทึกเรียบร้อยแล้ว',
      });

      router.push('/admin/checksuccess');
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

watch(physicianId, (newValue) => {
  console.log('physicianId:', newValue)
})

onMounted(async () => {
  await fetchPeriods()
  await fetchPhysicians()
  await fetchinfoTreatment()
  await fetchinfoDiagnosis()
  await fetchUsers()

  console.log('patientId : ', users.value.cdnumber)
})

definePageMeta({
  middleware: 'auth',
});
</script>
