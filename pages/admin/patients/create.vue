<script setup>
import { useUserStore } from '~/stores/user.ts'
import adminLayouts from '~/layouts/adminLayout2.vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

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
    ],
    placeholder: 'กรุปเลือด'
  },
  {
    label: 'แพ้ยา',
    model: 'congenital',
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
    model: 'allergy',
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
]

const addressFields = [
  { label: 'บ้านเลขที่', model: 'houseNumber', type: 'number', placeholder: 'บ้านเลขที่' },
  { label: 'หมู่', model: 'village', type: 'number', placeholder: 'หมู่' },
  { label: 'รหัสไปรษณีย์', model: 'postalCode', type: 'number', placeholder: 'รหัสไปรษณีย์' },
  {
    label: 'จังหวัด',
    model: 'province',
    type: 'select',
    options: [],
    placeholder: 'เลือกจังหวัด'
  },
  {
    label: 'อำเภอ',
    model: 'district',
    type: 'select',
    options: [],
    placeholder: 'เลือกอำเภอ'
  },
  {
    label: 'ตำบล',
    model: 'subdistrict',
    type: 'select',
    options: [],
    placeholder: 'เลือกตำบล'
  }
]

const titleOptions = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
  { value: 'เด็กชาย', label: 'เด็กชาย' },
  { value: 'เด็กหญิง', label: 'เด็กหญิง' },
  { value: 'อื่น ๆ', label: 'อื่น ๆ' },
]

const newUser = ref({
  firstname: '',
  lastname: '',
  age: null,
  weight: null,
  height: null,
  blood_type: '',
  congenital: '',
  allergy: '',
  birthdate: '',
  phoneNumber: '',
  houseNumber: null,
  village: null,
  subdistrict: '',
  district: '',
  province: '',
  postalCode: null,
  title: ''
})

const formatPhoneNumber = (value) => {
  let cleaned = ('' + value).replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return cleaned.slice(0, 3) + '-' + cleaned.slice(3)
  return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 10)
}

const unformatPhoneNumber = (value) => {
  return ('' + value).replace(/\D/g, '')
}

const handlePhoneNumberInput = (event) => {
  const formattedValue = formatPhoneNumber(event.target.value)
  newUser.value.phoneNumber = formattedValue
}

const formatDateForDB = (dateString) => {
  const [year, month, day] = dateString.split('-')
  return new Date(`${year}-${month}-${day}`).toISOString()
}

const createUser = async () => {
  const userData = { ...newUser.value }
  if (userData.birthdate) {
    userData.birthdate = formatDateForDB(userData.birthdate)
  }
  userData.phoneNumber = unformatPhoneNumber(userData.phoneNumber)
  await userStore.addUser(userData)
  router.push('/admin/users')
}

const provinces = ref([])
const districts = ref([])
const subdistricts = ref([])
const postalCodeMap = ref({})

const fetchProvinces = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
    const provinceData = response.data
    provinces.value = provinceData.map(province => ({
      name: province.name_th,
      amphures: province.amphure.map(amphure => ({
        name: amphure.name_th,
        tambons: amphure.tambon.map(tambon => ({
          name: tambon.name_th,
          zip_code: tambon.zip_code
        }))
      }))
    }))

    // Create a map for easy lookup by postal code
    postalCodeMap.value = {}
    provinceData.forEach(province => {
      province.amphure.forEach(amphure => {
        amphure.tambon.forEach(tambon => {
          postalCodeMap.value[tambon.zip_code] = {
            subdistrict: tambon.name_th,
            district: amphure.name_th,
            province: province.name_th
          }
        })
      })
    })

    const provinceField = addressFields.find(field => field.model === 'province')
    provinceField.options = provinces.value.map(province => ({
      value: province.name,
      label: province.name
    }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(fetchProvinces)

watch(() => newUser.value.province, (newProvince) => {
  const selectedProvince = provinces.value.find(province => province.name === newProvince)
  districts.value = selectedProvince ? selectedProvince.amphures : []
  newUser.value.district = ''
  subdistricts.value = []

  const districtField = addressFields.find(field => field.model === 'district')
  districtField.options = districts.value.map(district => ({
    value: district.name,
    label: district.name
  }))
})

watch(() => newUser.value.district, (newDistrict) => {
  const selectedDistrict = districts.value.find(district => district.name === newDistrict)
  subdistricts.value = selectedDistrict ? selectedDistrict.tambons : []

  const subdistrictField = addressFields.find(field => field.model === 'subdistrict')
  subdistrictField.options = subdistricts.value.map(subdistrict => ({
    value: subdistrict.name,
    label: subdistrict.name
  }))
})

watch(() => newUser.value.subdistrict, (newSubdistrict) => {
  const selectedSubdistrict = subdistricts.value.find(subdistrict => subdistrict.name === newSubdistrict)
  if (selectedSubdistrict) {
    newUser.value.postalCode = selectedSubdistrict.zip_code
  }
})

// Watcher for postal code
watch(() => newUser.value.postalCode, (newPostalCode) => {
  const location = postalCodeMap.value[newPostalCode]
  if (location) {
    newUser.value.province = location.province
    newUser.value.district = location.district
    newUser.value.subdistrict = location.subdistrict
  }
})

watch(() => newUser.value.postalCode, async (newPostalCode) => {
  const location = postalCodeMap.value[newPostalCode]
  if (location) {
    newUser.value.province = location.province

    await nextTick()

    newUser.value.district = location.district

    await nextTick() 

    newUser.value.subdistrict = location.subdistrict
  }
})

definePageMeta({
  middleware: 'auth',
});

</script>

<template>
  <adminLayouts>
    <div class="flex items-center p-4">
      <div class="w-full">
        <h1 class="text-2xl font-bold mb-4 text-center">เพิ่มข้อมูลผู้ป่วย</h1>

        <form @submit.prevent="createUser">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-base">คำนำหน้า</span>
            </div>
            <select v-model="newUser.title" class="select select-bordered">
              <option disabled value="">เลือก</option>
              <option v-for="option in titleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <div class="grid grid-cols-3 gap-4 mt-5">
            <div v-for="(field, index) in fields" :key="index" class="form-control w-full mb-4">
              <span class="label-text text-base">{{ field.label }}</span>
              <template v-if="field.type === 'textarea'">
                <textarea v-model="newUser[field.model]" :placeholder="field.placeholder" class="textarea textarea-bordered w-full"></textarea>
              </template>
              <template v-else-if="field.type === 'select'">
                <select v-model="newUser[field.model]" class="select select-bordered">
                  <option disabled value="">{{ field.placeholder }}</option>
                  <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </template>
              <template v-else>
                <input 
                  v-model="newUser[field.model]" 
                  :type="field.type" 
                  :placeholder="field.placeholder" 
                  class="input input-bordered w-full"
                  @input="field.model === 'phoneNumber' ? handlePhoneNumberInput($event) : null"
                />
              </template>
            </div>
          </div>

          <div class="divider"></div>

          <div class="mt-5">
            <h1 class="text-2xl font-bold mb-4">ที่อยู่</h1>
            <div class="grid grid-cols-3 gap-4 my-3">
              <div v-for="(field, index) in addressFields" :key="index" class="form-control w-full mb-4">
                <span class="label-text text-base">{{ field.label }}</span>
                <template v-if="field.type === 'select'">
                  <select v-model="newUser[field.model]" class="select select-bordered">
                    <option disabled value="">{{ field.placeholder }}</option>
                    <option v-for="option in field.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  <input v-model="newUser[field.model]" :type="field.type" :placeholder="field.placeholder" class="input input-bordered w-full" />
                </template>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <button type="submit" class="btn btn-primary font-bold w-full text-lg">เพิ่มข้อมูลผู้ป่วย</button>
        </form>
      </div>
    </div>
  </adminLayouts>
</template>