<template>
  <UserLayout>
    <div class="sm:hidden">
      <details class="dropdown">
        <summary class="btn btn-accent m-1">
          <p class="text-white">เมนูการตั้งค่า</p>
        </summary>
        <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li>
            <RouterLink to="/user/profile"
              class="btn sm:btn-base btn-sm btn-accent w-full rounded-full text-white font-light mt-2">
              ตั้งค่าโปรไฟล์</RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/addresses"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ข้อมูลที่อยู่
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/medicalhistory"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ประวัติการรักษา
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/user/profile/bookinghistory"
              class="btn btn-accent sm:btn-base btn-sm rounded-full text-white font-light mt-2">ประวัติการจอง
            </RouterLink>
          </li>
          <li>
            <div class="btn bg-red-500 sm:btn-base btn-sm rounded-full text-white font-light mt-2">ออกจากระบบ</div>
          </li>
        </ul>
      </details>
    </div>
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5 sm:h-[550px] h-[400px]">
      <!-- Use the ProfileAside component -->
      <ProfileAside class="hidden sm:block" />

      <div class="flex-1 p-5 font-kanit">
        <div>
          <div class="flex justify-center">
            <div
              class="flex justify-center items-center bg-[#FF8128] sm:w-[60%] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
              <h2 class="sm:text-4xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">ข้อมูลที่อยู่</h2>
            </div>
          </div>
          <div v-if="addresses.length > 0" class="mt-5">
            <div v-for="address in addresses" :key="address.id">
              <div class="bg-zinc-100 bg-opacity-70 text-stone-700 p-4 rounded-md shadow-md text-lg">
                <p><strong class="text-xl">บ้านเลขที่</strong> {{ address.houseNumber }} <strong class="text-xl">หมู่</strong> {{ address.village }}
                </p>
                <p><strong class="text-xl">ตำบล</strong> {{ address.subdistrict }}, <strong class="text-xl">อำเภอ</strong> {{ address.district }}
                </p>
                <p>
                  <strong class="text-xl">จังหวัด</strong>  {{ address.province }}
                </p>
                <p class="flex gap-2">
                <p class="font-bold text-xl">รหัสไปรษณี  </p> {{ address.postalCode }}</p>
                <p><strong class="text-xl">เบอร์โทรศัพท์  </strong>{{ address.phoneNumber }}</p>

                <RouterLink :to="`/user/profile/address/edit/${address.id}`"
                  class="btn btn-base btn-primary text-white mt-2 w-full">
                  <p class="text-base">แก้ไข</p>
                </RouterLink>
                <button @click="deleteAddress(address.id)" class="btn btn-base btn-error text-white mt-2 w-full">
                  <p class="text-base">ลบ</p>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="mt-5 flex justify-center items-center h-24">
            คุณยังไม่มีที่อยู่
            <!-- <RouterLink to="/user/profile/address" class="btn btn-accent text-white font-light ml-2">
              เพิ่มตรงนี้เลย
            </RouterLink> -->
            <!-- You can open the modal using ID.showModal() method -->
            <button class="btn btn-accent text-white font-light ml-2"
              onclick="my_modal_3.showModal()">เพิ่มตรงนี้เลย</button>
            <dialog id="my_modal_3" class="modal" ref="addressModal">
              <div class="modal-box">
                <form method="dialog">
                  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div class="flex">
                  <font-awesome-icon :icon="['fas', 'house']" size="3x" class="text-orange-400 mt-1" />
                  <h3 class="ml-3 mt-3 text-4xl font-bold">เพิ่มข้อมูลที่อยู่</h3>
                </div>



                <!-- Address Input Form -->
                <div>
                  <div class="flex gap-3 mt-3">
                    <div class="form-control w-full mt-5">
                      <label class="label"><span class="label-text text-lg">บ้านเลขที่</span></label>
                      <input v-model="address.houseNumber" type="number" placeholder="บ้านเลขที่"
                        class="input input-bordered w-full text-lg" />
                    </div>
                    <div class="form-control w-full mt-5">
                      <label class="label"><span class="label-text text-lg">หมู่</span></label>
                      <input v-model="address.village" type="number" placeholder="หมู่ที่"
                        class="input input-bordered w-full text-lg" />
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <div class="form-control w-full">
                      <div class="label">
                        <span class="label-text text-lg">จังหวัด</span>
                      </div>
                      <select v-model="address.province" @change="onProvinceChange"
                        class="select select-bordered w-full text-lg">
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
                      <select v-model="address.district" @change="onDistrictChange"
                        class="select select-bordered w-full text-lg" :disabled="!districts.length">
                        <option disabled value="">เลือกอำเภอ</option>
                        <option v-for="district in districts" :key="district" :value="district">
                          {{ district }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <div class="form-control w-full">
                      <div class="label">
                        <span class="label-text text-lg">ตำบล</span>
                      </div>
                      <select v-model="address.subdistrict" @change="onSubdistrictChange"
                        class="select select-bordered w-full text-lg" :disabled="!subdistricts.length">
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
                      <input v-model="address.postalCode" type="number" placeholder="รหัสไปรษณีย์"
                        class="input input-bordered w-full text-lg" />
                    </div>
                  </div>

                  <div class="form-control w-full">
                    <label class="label"><span class="label-text text-lg">เบอร์โทรศัพท์</span></label>
                    <input v-model="address.phoneNumber" @input="handlePhoneNumberInput" type="text"
                      placeholder="เบอร์โทรศัพท์" class="input input-bordered w-full text-lg placeholder" />
                  </div>

                  <button @click="submitAddress" class="btn btn-accent w-full mt-5 text-white">ยืนยัน</button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import ProfileAside from '~/components/user/ProfileAside.vue';
import UserLayout from '~/layouts/userLayouts.vue';
import axios from 'axios';

// other imports
const authStore = useAuthStore();

const addresses = ref([])
const addressModal = ref(null);

const address = ref({
  country: 'ไทย',
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

const deleteAddress = async (addressId) => {
  if (confirm('คุณต้องการลบที่อยู่นี้หรือไม่?')) {
    try {
      const response = await axios.delete(`/api/users/address`, {
        params: { addressId }
      });

      if (response.data.success) {
        alert('ลบที่อยู่สำเร็จ');
        // Refresh the address list
        await fetchAddresses();
      } else {
        alert('ไม่สามารถลบที่อยู่ได้');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('เกิดข้อผิดพลาดขณะลบที่อยู่');
    }
  }
};

const fetchAddresses = async () => {
  try {
    const response = await axios.get(`/api/users/address?userId=${authStore.user.id}`);
    if (response.data.success) {
      addresses.value = response.data.addresses;
    } else {
      alert('Failed to fetch addresses');
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
    alert('An error occurred while fetching addresses');
  }
};

const submitAddress = async () => {
  try {
    const unformattedPhoneNumber = unformatPhoneNumber(address.value.phoneNumber);
    const response = await $fetch('/api/users/address', {
      method: 'POST',
      body: {
        userId: authStore.user.id,
        ...address.value,
        phoneNumber: unformattedPhoneNumber,
      }
    });

    if (response.success) {
      alert('Address added successfully');
      addressModal.value.close(); // Close the modal
      router.push('/user/profile/addresses');
      window.location.reload()
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
  await fetchAddresses()
  await fetchCountries()
  await fetchProvinces()


})
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
