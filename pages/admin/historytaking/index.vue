<template>
  <AdminLayout>
    <div class="container mx-auto p-4">
      <div class="flex bg-white rounded-full mt-3 shadow-md">
        <div class="flex-1 mt-4 pl-3">
          <div class="divider divider-accent"></div>
        </div>
        <div class="flex-2">
          <h1 class="font-light text-4xl p-4">ซักประวัติ</h1>
        </div>
        <div class="flex-1 mt-4 pr-4">
          <div class="divider divider-accent"></div>
        </div>
      </div>
      <form @submit.prevent="searchPatients" class="mt-5">
        <input v-model="query" type="text" placeholder="ใส่ชื่อเพื่อค้นหา" class="input input-bordered input-accent mb-4 w-full" />
        <button type="submit" class="btn btn-accent w-full text-white">Search</button>
      </form>

      <div v-if="patients.length === 0" class="mt-4">
        <p>ไม่พบข้อมูล</p>
      </div>

      <ul v-else class="mt-4">
        <div v-for="(patient, index) in patients" :key="'patient-' + patient.id" class="grid grid-cols-2 gap-4 mt-5">
          <div class="shadow-md rounded-md p-4 flex flex-col h-full font-sarabun">
            <div class="flex">
              <div class="flex items-start">
                <img src="https://img2.pic.in.th/pic/users_391194.png" alt="" class="w-32 h-24">
              </div>
              <div class="pt-2 mx-10 flex flex-col justify-between w-full">
                <div class="flex">
                  <div class="text-lg w-full ml-5">
                    <p><strong>ชื่อ:</strong> {{ patient.firstname }}</p>
                    <p class="pt-2"><strong>ส่วนสูง:</strong> {{ patient.height }} cm</p>
                    <p class="pt-2"><strong>อายุ:</strong> {{ patient.age }}</p>
                    <p class="pt-2"><strong>น้ำหนัก:</strong> {{ patient.weight }} kg</p>
                  </div>
                  <div class="text-lg w-full">
                    <p><strong>นามสกุล:</strong> {{ patient.lastname }}</p>
                    <p class="pt-2"><strong>กรุ๊ปเลือด:</strong> {{ patient.blood_type }}</p>
                    <p class="pt-2"><strong>แพ้ยา:</strong> {{ patient.allergy }}</p>
                    <p class="pt-2"><strong>โรคประจำตัว:</strong> {{ patient.congenital }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-auto">
              <button class="btn btn-accent text-white mt-5 w-full"
                @click="goToWaitCheck(patient.id)">ซักประวัติ</button>
            </div>
          </div>
        </div>



      </ul>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '~/layouts/adminLayouts.vue'
import { ref, watch } from 'vue'
import { useFetch, useRouter } from '#app'

const query = ref('')
const patients = ref([])
const showDetails = ref([])
const router = useRouter()

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}-${month}-${year}`
}

const fields = [
  { label: 'ชื่อ', model: 'firstname', type: 'text', placeholder: 'ชื่อ' },
  { label: 'นามสกุล', model: 'lastname', type: 'text', placeholder: 'นามสกุล' },
  { label: 'อายุ', model: 'age', type: 'number', placeholder: 'อายุ' },
  { label: 'วันเกิด', model: 'birthdate', type: 'text', placeholder: 'วันเกิด', format: formatDate },
  { label: 'น้ำหนัก', model: 'weight', type: 'number', step: '0.1', placeholder: 'น้ำหนัก' },
  { label: 'ส่วนสูง', model: 'height', type: 'number', step: '0.1', placeholder: 'ส่วนสูง' },
  { label: 'กรุปเลือด', model: 'blood_type', type: 'text', placeholder: 'กรุปเลือด' },
  { label: 'แพ้ยา', model: 'allergy', type: 'textarea', placeholder: 'กรุณากรอกข้อมูลแพ้ยา' },
  { label: 'โรคประจำตัว', model: 'congenital', type: 'textarea', placeholder: 'กรุณากรอกข้อมูลโรคประจำตัว' },
  { label: 'เบอร์โทรศัพท์', model: 'phoneNumber', type: 'text', placeholder: 'เบอร์โทรศัพท์' },
]

const addressFields = [
  { label: 'บ้านเลขที่', model: 'houseNumber', type: 'number', placeholder: 'บ้านเลขที่' },
  { label: 'หมู่', model: 'village', type: 'number', placeholder: 'หมู่' },
  { label: 'ตำบล', model: 'subdistrict', type: 'text', placeholder: 'ตำบล' },
  { label: 'อำเภอ', model: 'district', type: 'text', placeholder: 'อำเภอ' },
  { label: 'จังหวัด', model: 'province', type: 'text', placeholder: 'จังหวัด' },
  { label: 'รหัสไปรษณีย์', model: 'postalCode', type: 'number', placeholder: 'รหัสไปรษณีย์' },
]

const searchPatients = async () => {
  if (query.value.trim() === '') {
    patients.value = []
    showDetails.value = []
    return
  }

  const { data } = await useFetch(`/api/searchPatients?query=${query.value}`)
  patients.value = data.value || []
  showDetails.value = patients.value.map(() => true)
}

const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

const debouncedSearchPatients = debounce(searchPatients, 300)
watch(query, (newQuery) => {
  debouncedSearchPatients()
})

const goToWaitCheck = (patientId) => {
  router.push(`/admin/historytaking/checktreat?id=${patientId}&historyComplete=true`)
}
</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
</style>
