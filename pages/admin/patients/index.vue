<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user.ts'
import { writeFile, utils } from 'xlsx'
import adminLayouts from '~/layouts/adminLayout2.vue'

const userStore = useUserStore()
const selectedUser = ref(null)

const deleteUser = async (id) => {
  await userStore.deleteUser(id)
}

const columns = [
  { title: 'หมายเลข', field: 'id' },
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

const formFields = [
  { label: 'อายุ', field: 'age', type: 'number' },
  { label: 'น้ำหนัก', field: 'weight', type: 'number' },
  { label: 'ส่วนสูง', field: 'height', type: 'number' },
  { label: 'กรุปเลือด', field: 'blood_type', type: 'text' },
  { label: 'แพ้ยา', field: 'allergy', type: 'text' },
  { label: 'โรคประจำตัว', field: 'congenital', type: 'text' },
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

const openModal = (user) => {
  selectedUser.value = { ...user }
}

const closeModal = () => {
  selectedUser.value = null
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

onMounted(async() => {
  await userStore.fetchUsers()
})

definePageMeta({
  middleware: 'auth',
});
</script>



<template>
  <adminLayouts>
    <div class="mx-auto p-4 bg-white h-full">
      <div class="mb-4">
        <div
          class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
          <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลผู้ป่วย</h2>
        </div>
      </div>

      <div class=" mt-5">
        <nuxt-link to="/admin/patients/create"
          class="btn btn-accent w-full font-light text-white">เพิ่มข้อมูลคนไข้</nuxt-link>
      </div>

      <div class="overflow-x-auto mt-5">
        <table class="table w-full text-left border-collapse">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.field" class="border p-2 text-center">
                <p class="text-sm">{{ column.title }}</p>
              </th>
              <th class="border p-2 text-center">{{ actionsColumn.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users" :key="user.id">
              <td v-for="column in columns" :key="column.field" class="border p-2">
                <p class="text-sm text-center">{{ user[column.field] }}</p>
              </td>
              <td class="border p-2">
                <div class="flex justify-center gap-3">
                  <nuxt-link :to="`/admin/patients/edit/${user.id}`" class="btn btn-primary">
                    <p class="font-light text-white">แก้ไข</p>
                  </nuxt-link>
                  <button @click="deleteUser(user.id)" class="btn btn-secondary">
                    <p class="font-light text-white">ลบ</p>
                  </button>
                  <button @click="openModal(user)" class="btn btn-accent text-white font-light">ดูเพิ่มเติม</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
        <div class="overflow-y-auto">
          <div class="flex mt-5">

            <div class="flex-2 p-8">
              <div class="avatar flex justify-center">
                <div class="w-48 rounded">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div class="bg-zinc-100 h-24 mt-5">
                asd
              </div>
            </div>

            <div class="flex-1">
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
                <h1>เกิดวันที่ : {{ selectedUser.birthdate }}</h1>
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

            <div class="flex-1 justify-start">
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
            </div>
          </div>

          <div class="divider"></div>
          
          <div class=" ">
            <div class="p-4 font-bold text-2xl">
              <h1>ประวัติการรักษา</h1>
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