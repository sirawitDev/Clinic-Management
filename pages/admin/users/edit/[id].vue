<template>
  <AdminLayout>
    <div class=" bg-white h-14">
      <div class=" flex">
        <h1 class=" items-center text-3xl font-bold p-2 mx-2 mt-1">แก้ไขข้อมูล</h1>
      </div>
    </div>
    <div class="container mx-auto p-4 mt-5">
      <form @submit.prevent="updateUser">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label class="form-control w-full mt-2">
            <div class="mb-4">
              <span class="label-text text-base">คำนำหน้า</span>
            </div>
            <select v-model="editUser.title" class="select select-bordered">
              <option disabled value="">เลือก</option>
              <option v-for="option in titleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label v-for="(field, index) in fields" :key="index" class="form-control w-full mb-4">
            <div class="label mb-2">
              <span class="label-text text-base">{{ field.label }}</span>
            </div>
            <div v-if="field.type === 'textarea'">
              <textarea v-model="editUser[field.model]" :placeholder="field.placeholder"
                class="input input-bordered w-full h-24 placeholder-centered"></textarea>
            </div>
            <div v-else>
              <input v-model="editUser[field.model]" :type="field.type" :placeholder="field.placeholder"
                class="input input-bordered w-full" />
            </div>
          </label>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">ที่อยู่</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label v-for="(field, index) in addressFields" :key="index" class="form-control w-full mb-4">
              <div class="label mb-2">
                <span class="label-text text-base">{{ field.label }}</span>
              </div>
              <input v-model="editUser[field.model]" :type="field.type" :placeholder="field.placeholder"
                class="input input-bordered w-full" />
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button @click="cancelEdit" type="button" class="btn btn-secondary btn-lg">ย้อนกลับ</button>
          <button type="submit" class="btn btn-primary btn-lg">ยืนยัน</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user.ts'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '~/layouts/adminLayouts.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const editUser = ref({
  id: null,
  firstname: '',
  lastname: '',
  age: null,
  birthdate: '',
  weight: null,
  height: null,
  blood_type: '',
  congenital: '',
  allergy: '',
  phoneNumber: '',
  houseNumber: null,
  village: null,
  subdistrict: '',
  district: '',
  province: '',
  postalCode: null,
  title: ''
})

const fields = [
  { label: 'ชื่อ', model: 'firstname', type: 'text', placeholder: 'ชื่อ' },
  { label: 'นามสกุล', model: 'lastname', type: 'text', placeholder: 'นามสกุล' },
  { label: 'อายุ', model: 'age', type: 'number', placeholder: 'อายุ' },
  { label: 'วันเกิด', model: 'birthdate', type: 'date', placeholder: 'วันเกิด' },
  { label: 'น้ำหนัก', model: 'weight', type: 'number', step: '0.1', placeholder: 'น้ำหนัก' },
  { label: 'ส่วนสูง', model: 'height', type: 'number', step: '0.1', placeholder: 'ส่วนสูง' },
  { label: 'กรุปเลือด', model: 'blood_type', type: 'text', placeholder: 'กรุปเลือด' },
  { label: 'แพ้ยา', model: 'congenital', type: 'textarea', placeholder: 'กรุณากรอกข้อมูลแพ้ยา' },
  { label: 'โรคประจำตัว', model: 'allergy', type: 'textarea', placeholder: 'กรุณากรอกข้อมูลโรคประจำตัว' },
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

const titleOptions = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
  { value: 'เด็กชาย', label: 'เด็กชาย' },
  { value: 'เด็กหญิง', label: 'เด็กหญิง' },
  { value: 'อื่น ๆ', label: 'อื่น ๆ' },
]

const loadUser = async () => {
  const userId = parseInt(route.params.id)
  const users = userStore.users
  const user = users.find(user => user.id === userId)
  if (user) {
    // Format the birthdate to YYYY-MM-DD if it's not null or undefined
    if (user.birthdate) {
      user.birthdate = new Date(user.birthdate).toISOString().split('T')[0];
    }
    editUser.value = { ...user }
  } else {
    router.push('/users')
  }
}

const updateUser = async () => {
  if (editUser.value.birthdate) {
    editUser.value.birthdate = new Date(editUser.value.birthdate).toISOString();
  }

  await userStore.updateUser(editUser.value);
  router.push('/admin/users');
}

const cancelEdit = () => {
  router.push('/admin/users')
}

onMounted(() => {
  loadUser()
})
</script>