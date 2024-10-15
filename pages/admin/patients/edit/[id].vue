<template>
  <AdminLayout>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
      <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">แก้ไขข้อมูลผู้ป่วย</h2>
    </div>
    <div class="container mx-auto p-4 mt-5 bg-white rounded-md">
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

            <div v-if="field.model === 'phoneNumber'">
              <input v-model="editUser[field.model]" type="text" :placeholder="field.placeholder"
                class="input input-bordered w-full" @input="formatPhoneNumber" maxlength="12" />
            </div>

            <div v-else-if="field.model === 'blood_type'">
              <select v-model="editUser[field.model]" class="select select-bordered w-full">
                <option disabled value="">{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input v-if="editUser.blood_type === 'อื่น ๆ'" v-model="customฺBloodtype" type="text"
                    placeholder="ระบุเลือด" class="input input-bordered w-full mt-2" />
            </div>

            <div v-else-if="field.model === 'allergy'">
              <select v-model="editUser[field.model]" class="select select-bordered w-full">
                <option disabled value="">{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input v-if="editUser.allergy === 'อื่น ๆ'" v-model="customAllergy" type="text"
                    placeholder="ระบุแพ้ยา" class="input input-bordered w-full mt-2" />
            </div>

            <div v-else-if="field.model === 'congenital'">
              <select v-model="editUser[field.model]" class="select select-bordered w-full">
                <option disabled value="">{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input v-if="editUser.congenital === 'อื่น ๆ'" v-model="customCongenital" type="text"
                    placeholder="ระบุโรคประจำตัว" class="input input-bordered w-full mt-2" />
            </div>

            <div v-else-if="field.type === 'textarea'">
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

        <div class="flex justify-end gap-5 mt-8">
          <button @click="cancelEdit" type="button" class="btn btn-secondary w-60 text-white font-light">ย้อนกลับ</button>
          <button type="submit" class="btn btn-primary w-60 text-white font-light">ยืนยัน</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user.ts'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '~/layouts/adminLayout2.vue'

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
  {
    label: 'กรุปเลือด',
    model: 'blood_type',
    type: 'select',
    options: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'AB', label: 'AB' },
      { value: 'O', label: 'O' },
      { value: 'อื่น ๆ', label: 'อื่น ๆ' }
    ],
    placeholder: 'กรุปเลือด'
  },
  {
    label: 'แพ้ยา',
    model: 'allergy',
    type: 'select',
    options: [
      { value: 'ไม่มี', label: 'ไม่มี' },
      { value: 'ยาปฏิชีวนะ', label: 'ยาปฏิชีวนะ' },
      { value: 'ยาแก้ปวด', label: 'ยาแก้ปวด' },
      { value: 'อื่น ๆ', label: 'อื่น ๆ' }
    ],
    placeholder: 'กรุณากรอกข้อมูลแพ้ยา'
  },
  {
    label: 'โรคประจำตัว',
    model: 'congenital',
    type: 'select',
    options: [
      { value: 'ไม่มี', label: 'ไม่มี' },
      { value: 'เบาหวาน', label: 'เบาหวาน' },
      { value: 'ความดันโลหิตสูง', label: 'ความดันโลหิตสูง' },
      { value: 'อื่น ๆ', label: 'อื่น ๆ' }
    ],
    placeholder: 'กรุณากรอกข้อมูลโรคประจำตัว'
  },
  { label: 'เบอร์โทรศัพท์', model: 'phoneNumber', type: 'text', placeholder: 'เบอร์โทรศัพท์' },
  { label: 'เลขบัตรประชาชน', model: 'cdnumber', type: 'text', placeholder: 'เลขบัตรประชาชน' },
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

const customCongenital = ref('')
const customAllergy = ref('')
const customฺBloodtype = ref('')

const loadUser = async () => {
  const userId = parseInt(route.params.id)
  const users = userStore.users
  const user = users.find(user => user.id === userId)
  if (user) {
    // Format the birthdate to YYYY-MM-DD if it's not null or undefined
    if (user.birthdate) {
      user.birthdate = new Date(user.birthdate).toISOString().split('T')[0];
    }

    if (user.allergy) {
      customAllergy.value = user.allergy
    }
    if (user.congenital) {
      customCongenital.value = user.congenital
    }

    if (user.phoneNumber) {
      let input = user.phoneNumber.replace(/\D/g, '');
      if (input.length > 3 && input.length <= 6) {
        input = `${input.slice(0, 3)}-${input.slice(3)}`;
      } else if (input.length > 6) {
        input = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6, 10)}`;
      }
      user.phoneNumber = input;
    }

    editUser.value = { ...user }
  } else {
    router.push('/users')
  }
}

const formatPhoneNumber = (e) => {
  let input = e.target.value.replace(/\D/g, ''); // เอาตัวเลขออกเท่านั้น
  if (input.length > 3 && input.length <= 6) {
    input = `${input.slice(0, 3)}-${input.slice(3)}`;
  } else if (input.length > 6) {
    input = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6, 10)}`;
  }
  editUser.value.phoneNumber = input;
};

const updateUser = async () => {
  if (editUser.value.congenital === 'อื่น ๆ') {
    editUser.value.congenital = customCongenital.value
  }

  if (editUser.value.allergy === 'อื่น ๆ') {
    editUser.value.allergy = customAllergy.value
  }

  if (editUser.value.blood_type === 'อื่น ๆ') {
    editUser.value.blood_type = customฺBloodtype.value
  }
  if (editUser.value.birthdate) {
    editUser.value.birthdate = new Date(editUser.value.birthdate).toISOString();
  }

  await userStore.updateUser(editUser.value);
  router.push('/admin/patients');
}

const cancelEdit = () => {
  router.push('/admin/patients')
}

onMounted(async() => {
  await loadUser()
})

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>