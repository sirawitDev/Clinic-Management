<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user.ts'
import { writeFile, utils } from 'xlsx'
import adminLayouts from '~/layouts/adminLayout2.vue'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const selectedUser = ref(null)
const diagnoses = ref([])

const deleteUser = async (id) => {

  await userStore.deleteUser(id);
};

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime)
  const formattedDate = date.toISOString().split('T')[0]
  const formattedTime = date.toTimeString().split(' ')[0]
  return `${formattedDate} / ${formattedTime}`
}

const formatBirthdate = (birthdate) => {
  const date = new Date(birthdate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  return date.toLocaleDateString('th-TH', options); // Format in Thai locale
};

const columns = [
  { title: 'ลำดับ', field: 'id' },
  { title: 'คำนำหน้า', field: 'title' },
  { title: 'ชื่อ', field: 'firstname' },
  { title: 'นามสกุล', field: 'lastname' },
  { title: 'อายุ', field: 'age' },
  { title: 'น้ำหนัก', field: 'weight' },
  { title: 'ส่วนสูง', field: 'height' },
  { title: 'กรุปเลือด', field: 'blood_type' },
  { title: 'แพ้ยา', field: 'allergy' },
  { title: 'โรคประจำตัว', field: 'congenital' },
]

const formAddress = [
  { label: 'บ้านเลขที่', field: 'houseNumber', type: 'text' },
  { label: 'หมู่', field: 'village', type: 'text' },
  { label: 'ตำบล', field: 'subdistrict', type: 'text' },
  { label: 'อำเภอ', field: 'district', type: 'text' },
  { label: 'จังหวัด', field: 'province', type: 'text' },
  { label: 'รหัสไปรษณีย์', field: 'postalCode', type: 'text' },
]

const actionsColumn = { title: '', field: 'actions' }

const openModal = async (user) => {
  selectedUser.value = { ...user }
  await DiagnosisCdnumber(user.cdnumber)
}

const closeModal = () => {
  selectedUser.value = null
  diagnoses.value = []
}


const fullName = computed({
  get() {
    if (!selectedUser.value) return ''
    return `${selectedUser.value.firstname || ''} ${selectedUser.value.lastname || ''}`.trim()
  },
  set(value) {
    if (!selectedUser.value) return
    const [firstname, ...lastname] = value.split(' ')
    selectedUser.value.firstname = firstname || ''
    selectedUser.value.lastname = lastname.join(' ') || ''
  }
})

const exportToExcel = () => {
  const data = userStore.users.map(user => ({
    หมายเลข: user.id,
    คำนำหน้า: user.title,
    ชื่อ: user.firstname,
    นามสกุล: user.lastname,
    อายุ: user.age,
    น้ำหนัก: user.weight,
    ส่วนสูง: user.height,
    กรุปเลือด: user.blood_type,
    แพ้ยา: user.allergy,
    โรคประจำตัว: user.congenital,
  }))

  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Users')

  writeFile(workbook, 'UserData.xlsx')
}

const DiagnosisCdnumber = async (cdnumber) => {
  try {
    const response = await fetch(`/api/users/diagnosis/${cdnumber}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch diagnoses');
    }

    const data = await response.json();
    diagnoses.value = data;
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
  }
};

onMounted(async () => {
  await userStore.fetchUsers()
  console.log('user : ', diagnoses.value)
})

watch(() => {
  console.log('user : ', diagnoses.value)
})

definePageMeta({
  middleware: 'auth',
});
</script>



<template>
  <adminLayouts>
    <div class="mx-auto p-4 bg-zinc-50 h-full">
      <div class="bg-white p-3">
        <div class="mb-4">
          <div
            class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
            <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลผู้ป่วย</h2>
          </div>
        </div>

        <div class=" mt-5">
          <nuxt-link to="/admin/patients/create"
            class="btn btn-accent w-full font-light text-white sm:text-base text-sm">เพิ่มข้อมูลคนไข้</nuxt-link>
        </div>

        <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
          <table class="table w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-500 text-white text-base">
                <th v-for="column in columns" :key="column.field" class=" p-2 text-center">
                  <p class="sm:text-base font-medium text-[12px]">{{ column.title }}</p>
                </th>
                <th class=" p-2 text-center">{{ actionsColumn.title }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in userStore.users" :key="user.id">
                <td v-for="column in columns" :key="column.field" class=" border-slate-500 p-2">
                  <p class="sm:text-sm text-[13px] text-center">{{ user[column.field] }}</p>
                </td>
                <td class=" p-2">
                  <div class="flex justify-center gap-3 p-4">
                    <nuxt-link :to="`/admin/patients/edit/${user.id}`" class="btn btn-primary sm:btn-md btn-sm">
                      <p class="font-light text-white sm:text-base text-[12px]">แก้ไข</p>
                    </nuxt-link>
                    <button @click="deleteUser(user.id)" class="btn btn-secondary sm:btn-md btn-sm">
                      <p class="font-light text-white sm:text-base text-[12px]">ลบ</p>
                    </button>
                    <button @click="openModal(user)"
                      class="btn sm:btn-md btn-sm btn-accent text-white font-light sm:text-base text-[12px]">ดูเพิ่มเติม</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-5">
      <button @click="exportToExcel" class="btn btn-primary font-light text-white">
        Export to Excel
      </button>
    </div>

    <!-- Modal Overlay -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg relative w-[55%] max-h-[70%] flex flex-col overflow-hidden">
        <!-- Header with close button -->
        <div class="p-4 flex justify-between items-center bg-orange-300 sticky top-0 z-10">
          <h3 class="text-2xl font-bold text-white">ข้อมูลเพิ่มเติม</h3>
          <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="overflow-y-auto bg-zinc-100">
          <div class="flex mt-5 gap-2">

            <div class="flex-2 p-8">
              <div class="avatar flex justify-center">
                <div class="w-48 rounded">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>

            <div class="flex-1 bg-white rounded-lg p-4">
              <div>
                <h1 class=" font-bold text-2xl">ข้อมูลส่วนตัว</h1>
              </div>
              <div class="mt-5">
                <h1>ชื่อ : {{ selectedUser.title }} {{ selectedUser.firstname }} {{ selectedUser.lastname }}</h1>
              </div>
              <div class="mt-5">
                <h1>อายุ : {{ selectedUser.age }}</h1>
              </div>
              <div class="mt-5">
                <h1>เกิดวันที่ : {{ formatBirthdate(selectedUser.birthdate) }}</h1>
              </div>
              <div class="mt-5">
                <h1>น้ำหนัก : {{ selectedUser.weight }}</h1>
              </div>
              <div class="mt-5">
                <h1>ส่วนสูง : {{ selectedUser.height }}</h1>
              </div>
              <div class="mt-5">
                <h1>กรุ๊ปเลือด : {{ selectedUser.blood_type }}</h1>
              </div>
              <div class="mt-5">
                <h1>เบอร์โทรศัพท์ : {{ selectedUser.phoneNumber }}</h1>
              </div>
              <div class="mt-5">
                <h1>แพ้ยา : {{ selectedUser.congenital }}</h1>
              </div>
              <div class="mt-5">
                <h1>โรคประจำตัว : {{ selectedUser.allergy }}</h1>
              </div>
            </div>

            <div class="flex-1 justify-start rounded-lg p-4 bg-white">
              <div>
                <h1 class=" font-bold text-2xl">ที่อยู่</h1>
              </div>
              <div class="mt-5">
                <h1>บ้านเลขที่ : {{ selectedUser.houseNumber }}</h1>
              </div>
              <div class="mt-5">
                <h1>หมู่ : {{ selectedUser.village }}</h1>
              </div>
              <div class="mt-5">
                <h1>ตำบล : {{ selectedUser.subdistrict }}</h1>
              </div>
              <div class="mt-5">
                <h1>อำเภอ : {{ selectedUser.district }}</h1>
              </div>
              <div class="mt-5">
                <h1>จังหวัด : {{ selectedUser.province }}</h1>
              </div>
              <div class="mt-5">
                <h1>รหัสไปรษณีย์ : {{ selectedUser.postalCode }}</h1>
              </div>
              <div class="mt-5">
                <h1>เลขบัตรประชาชน : {{ selectedUser.cdnumber }}</h1>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="p-4">

            <div class="flex justify-center">
              <div
                class="flex justify-center items-center bg-[#FF8128] sm:w-[50%] w-full h-20 shadow-md rounded-full bg-opacity-50">
                <h2 class="sm:text-4xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">ประวัติการรักษา
                </h2>
              </div>
            </div>

            <div class="bg-white p-3 mt-5">

              <div class="overflow-x-auto">
                <table class="table">
                  <!-- head -->
                  <thead>
                    <tr>
                      <th>วันที่การรักษา</th>
                      <th>อาการ</th>
                      <th>ทานยา</th>
                      <th>ระยะการทานยา</th>
                      <th>แพทย์ผู้รักษา</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- row 1 -->
                    <tr v-for="diagnosis in diagnoses" :key="diagnosis.id">
                      <td>{{ formatDateTime(diagnosis.createdAt) }}</td>
                      <td>{{ diagnosis.diagnosis }}</td>
                      <td>{{ diagnosis.treatment_plan }}</td>
                      <td>{{ diagnosis.notes }}</td>
                      <td>{{ diagnosis.physician.first_name }} {{ diagnosis.physician.last_name }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>