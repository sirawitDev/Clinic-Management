<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-5">
      <div class="font-bold text-3xl p-5">แก้ไขที่อยู่</div>

      <div class="flex flex-col items-center my-2">
        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">บ้านเลขที่</span>
          </div>
          <input v-model="address.houseNumber" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">หมู่</span>
          </div>
          <input v-model="address.village" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">ประเทศ</span>
          </div>
          <select v-model="address.country" class="select select-bordered w-full">
            <option disabled value="">เลือกประเทศ</option>
            <option v-for="country in countries" :key="country.alpha2" :value="country.name">
              {{ country.name }} ({{ country.enName }})
            </option>
          </select>
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">จังหวัด</span>
          </div>
          <select v-model="address.province" @change="onProvinceChange" class="select select-bordered w-full">
            <option disabled value="">เลือกจังหวัด</option>
            <option v-for="province in provinces" :key="province.name" :value="province.name">
              {{ province.name }}
            </option>
          </select>
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">อำเภอ</span>
          </div>
          <select v-model="address.district" @change="onDistrictChange" class="select select-bordered w-full" :disabled="!districts.length">
            <option disabled value="">เลือกอำเภอ</option>
            <option v-for="district in districts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">ตำบล</span>
          </div>
          <select v-model="address.subdistrict" @change="onSubdistrictChange" class="select select-bordered w-full" :disabled="!subdistricts.length">
            <option disabled value="">เลือกตำบล</option>
            <option v-for="subdistrict in subdistricts" :key="subdistrict.name" :value="subdistrict.name">
              {{ subdistrict.name }}
            </option>
          </select>
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">รหัสไปรษณีย์</span>
          </div>
          <input v-model="address.postalCode" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>

        <div class="form-control w-full mb-4">
          <div class="label">
            <span class="label-text">เบอร์โทรศัพท์</span>
          </div>
          <input v-model="address.phoneNumber" @input="handlePhoneNumberInput" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>

        <button @click="updateAddress" class="btn btn-neutral w-full mt-4">บันทึกการเปลี่ยนแปลง</button>
      </div>
    </div>
  </UserLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import UserLayout from '~/layouts/userLayouts.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const address = ref({
  country: '',
  houseNumber: '',
  village: '',
  subdistrict: '',
  district: '',
  province: '',
  postalCode: '',
  phoneNumber: '',
});

const addresses = ref([]);

const provinces = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const countries = ref([]);

const fetchAddresses = async () => {
  try {
    const response = await axios.get(`/api/users/address?userId=${authStore.user.id}`);
    if (response.data.success) {
      addresses.value = response.data.addresses;

      // Set the first address or handle selection logic here
      if (addresses.value.length > 0) {
        const firstAddress = addresses.value[0];
        address.value = {
          ...address.value,
          country: firstAddress.country || '',
          houseNumber: firstAddress.houseNumber || '',
          village: firstAddress.village || '',
          subdistrict: firstAddress.subdistrict || '',
          district: firstAddress.district || '',
          province: firstAddress.province || '',
          postalCode: firstAddress.postalCode || '',
          phoneNumber: firstAddress.phoneNumber || '',
        };

        // Call to update provinces, districts, and subdistricts based on the selected address
        updateLocationData();
      }
    } else {
      alert('Failed to fetch addresses');
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
    alert('An error occurred while fetching addresses');
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
};

const updateLocationData = () => {
  // Update provinces based on the fetched address
  const selectedProvince = address.value.province;
  const province = provinces.value.find(p => p.name === selectedProvince);
  if (province) {
    districts.value = province.amphures.map(amphure => amphure.name);
    
    // Update districts and subdistricts based on the selected address
    const selectedDistrict = address.value.district;
    const amphure = province.amphures.find(a => a.name === selectedDistrict);
    if (amphure) {
      subdistricts.value = amphure.tambons.map(tambon => ({
        name: tambon.name,
        zip_code: tambon.zip_code
      }));
    }
  }
};

// Add the rest of your existing methods here (onProvinceChange, onDistrictChange, etc.)...

onMounted(async () => {
  await fetchCountries();
  await fetchProvinces();
  await fetchAddresses();
});
</script>


