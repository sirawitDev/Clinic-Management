<template>
  <AdminLayout>
    <div class="container mx-auto p-4">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">ซักประวัติ</h2>
      </div>
      <form @submit.prevent="searchPatients" class="mt-5">
        <input v-model="query" type="text" placeholder="ใส่ชื่อเพื่อค้นหา"
          class="input input-bordered input-accent mb-4 w-full" />
        <button type="submit" class="btn btn-accent w-full text-white">Search</button>
      </form>

      <div class="bg-white w-full mt-2 rounded-lg ">
        <div class="flex justify-center sm:hidden">
          <div
            class="flex justify-center items-center bg-orange-400 sm:w-full w-48 sm:h-20 h-10  shadow-md rounded-full mt-5 bg-opacity-90">
            <h2 class="sm:text-5xl text-2xl font-bold text-white tracking-wide">ข้อมูลคนไข้</h2>
          </div>
        </div>

        <div class="divider pl-4 pr-4"></div>

        <div v-if="patients.length === 0" class="mt-4">
          <p>ไม่พบข้อมูล</p>
        </div>

        <ul v-else class="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4 p-3">
          <div v-for="(patient, index) in patients" :key="'patient-' + patient.id"
            class="shadow-md rounded-lg  flex flex-col h-full font-sarabun bg-base-100">
            <div class="flex">
              <div class="items-start hidden sm:block">
                <img src="https://img2.pic.in.th/pic/users_391194.png" alt="" class="w-32 h-24">
              </div>
              <div class="pt-2 mx-10 flex flex-col justify-between w-full">
                <div class="flex">
                  <div class="sm:text-lg text-base w-full">
                    <p><strong>ชื่อ:</strong> {{ patient.firstname }}</p>
                    <p class="pt-2"><strong>ส่วนสูง:</strong> {{ patient.height }} cm</p>
                    <p class="pt-2"><strong>อายุ:</strong> {{ patient.age }}</p>
                    <p class="pt-2"><strong>น้ำหนัก:</strong> {{ patient.weight }} kg</p>
                  </div>
                  <div class="sm:text-lg text-base w-full">
                    <p><strong>นามสกุล:</strong> {{ patient.lastname }}</p>
                    <p class="pt-2"><strong>กรุ๊ปเลือด:</strong> {{ patient.blood_type }}</p>
                    <p class="pt-2"><strong>แพ้ยา:</strong> {{ patient.allergy }}</p>
                    <p class="pt-2"><strong>โรคประจำตัว:</strong> {{ patient.congenital }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-auto flex justify-center">
              <button class="btn btn-accent text-white mt-5 sm:w-full w-48 mb-2"
                @click="goToWaitCheck(patient.id)">ซักประวัติ</button>
            </div>
          </div>
        </ul>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '~/layouts/adminLayout2.vue'
import { ref, onMounted } from 'vue'
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

// เรียกข้อมูลผู้ป่วยทั้งหมดเมื่อหน้าโหลด
onMounted(async () => {
  const { data } = await useFetch('/api/searchPatients?query=')
  patients.value = data.value || []
  showDetails.value = patients.value.map(() => true)
})

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

const goToWaitCheck = (patientId) => {
  router.push(`/admin/historytaking/checktreat?id=${patientId}&historyComplete=true`)
}

definePageMeta({
  middleware: 'auth',
});
</script>


<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
