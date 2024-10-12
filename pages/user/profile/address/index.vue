<template>
  <UserLayout>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
      <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลที่อยู่</h2>
    </div>
    <!-- เพิ่มช่องสำหรับ House Number -->
    <div class="form-control w-full mt-5">
      <div class="label">
        <span class="label-text text-lg">บ้านเลขที่</span>
      </div>
      <input v-model="address.houseNumber" type="number" placeholder="Type here" class="input input-bordered w-full text-lg" />
    </div>

    <!-- เพิ่มช่องสำหรับ Village -->
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">หมู่</span>
      </div>
      <input v-model="address.village" type="number" placeholder="Type here" class="input input-bordered w-full text-lg" />
    </div>

    <!-- เพิ่มช่องสำหรับ Country -->
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">ประเทศ</span>
      </div>
      <select v-model="address.country" class="select select-bordered w-full text-lg">
        <option disabled value="">เลือกประเทศ</option>
        <option v-for="country in countries" :key="country.alpha2" :value="country.name">
          {{ country.name }} ({{ country.enName }})
        </option>
      </select>
    </div>

    <!-- ช่องกรอกข้อมูลอื่นๆ ตามที่มีอยู่ -->
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">จังหวัด</span>
      </div>
      <select v-model="address.province" @change="onProvinceChange" class="select select-bordered w-full text-lg">
        <option disabled value="">เลือกจังหวัด</option>
        <option v-for="province in provinces" :key="province.name" :value="province.name">
          {{ province.name }}
        </option>
      </select>
    </div>
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">อำเภอ</span>
      </div>
      <select v-model="address.district" @change="onDistrictChange" class="select select-bordered w-full text-lg"
        :disabled="!districts.length">
        <option disabled value="">เลือกอำเภอ</option>
        <option v-for="district in districts" :key="district" :value="district">
          {{ district }}
        </option>
      </select>
    </div>
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">ตำบล</span>
      </div>
      <select v-model="address.subdistrict" @change="onSubdistrictChange" class="select select-bordered w-full text-lg"
        :disabled="!subdistricts.length">
        <option disabled value="">เลือกตำบล</option>
        <option v-for="subdistrict in subdistricts" :key="subdistrict.name" :value="subdistrict.name">
          {{ subdistrict.name }}
        </option>
      </select>
    </div>
    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">รหัสไปรษณีย์</span>
      </div>
      <input v-model="address.postalCode" type="number" placeholder="Type here" class="input input-bordered w-full text-lg" />
    </div>

    <div class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">เบอร์โทรศัพท์</span>
      </div>
      <input v-model="address.phoneNumber" @input="handlePhoneNumberInput" type="text" placeholder="Type here"
        class="input input-bordered w-full text-lg" />
    </div>

    <button @click="submitAddress" class="btn btn-accent w-full mt-5 text-white">ยืนยัน</button>
  </UserLayout>
</template>

<script lang="ts" setup>
import UserLayout from '~/layouts/userLayouts.vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();

const address = ref({
  country: '',
  houseNumber: null,
  village: null,
  subdistrict: '',
  district: '',
  province: '',
  postalCode: null,
  phoneNumber: '',
});

const router = useRouter()
const provinces = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const countries = ref([]);

const submitAddress = async () => {
  try {
    // Unformat the phone number before submitting
    const unformattedPhoneNumber = unformatPhoneNumber(address.value.phoneNumber);
    
    const response = await $fetch('/api/users/address', {
      method: 'POST',
      body: {
        userId: authStore.user.id,
        ...address.value,
        phoneNumber: unformattedPhoneNumber, // Use the unformatted phone number here
      }
    });

    if (response.success) {
      alert('Address added successfully');
      router.push('/user/profile');
    } else {
      alert('Failed to add address');
    }
  } catch (error) {
    console.error('Error adding address:', error);
    alert('An error occurred while adding the address');
  }
};




const fetchCountries = async () => {
  try {
    const response = await import('~/assets/data/countries.json');
    countries.value = response.default;
  } catch (error) {
    console.error('Error fetching countries data:', error);
  }
};

const fetchProvinces = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
    provinces.value = response.data.map(province => ({
      name: province.name_th,
      amphures: province.amphure.map(amphure => ({
        name: amphure.name_th,
        tambons: amphure.tambon.map(tambon => ({
          name: tambon.name_th,
          zip_code: tambon.zip_code
        }))
      }))
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Handle province change
const onProvinceChange = () => {
  const selectedProvince = address.value.province;
  const province = provinces.value.find(p => p.name === selectedProvince);
  if (province) {
    districts.value = province.amphures.map(amphure => amphure.name);
    address.value.district = ''; // Reset district and subdistrict
    address.value.subdistrict = '';
    subdistricts.value = [];
    address.value.postalCode = null; // Reset postal code
  } else {
    districts.value = [];
    subdistricts.value = [];
  }
};

// Handle district change
const onDistrictChange = () => {
  const selectedDistrict = address.value.district;
  const province = provinces.value.find(p => p.name === address.value.province);
  const amphure = province?.amphures.find(a => a.name === selectedDistrict);
  if (amphure) {
    subdistricts.value = amphure.tambons.map(tambon => ({
      name: tambon.name,
      zip_code: tambon.zip_code
    }));
    address.value.subdistrict = ''; // Reset subdistrict
    address.value.postalCode = null; // Reset postal code
  } else {
    subdistricts.value = [];
  }
};

// Handle subdistrict change
const onSubdistrictChange = () => {
  const selectedSubdistrict = address.value.subdistrict;
  const selectedSubdistrictData = subdistricts.value.find(sub => sub.name === selectedSubdistrict);
  address.value.postalCode = selectedSubdistrictData ? selectedSubdistrictData.zip_code : null; // Set postal code
};

// Phone number formatting functions
const formatPhoneNumber = (value) => {
  let cleaned = ('' + value).replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 10);
};

const unformatPhoneNumber = (value) => {
  return ('' + value).replace(/\D/g, '');
};

const handlePhoneNumberInput = (event) => {
  const formattedValue = formatPhoneNumber(event.target.value);
  address.value.phoneNumber = formattedValue; // Update phone number in the address object
};

authStore.initializeAuth();

onMounted(async () => {
  await fetchProvinces();
  await fetchCountries();
})
</script>

<style>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
