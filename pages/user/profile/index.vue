<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-5">
      <div class="font-bold text-3xl p-5">Profile</div>

      <div class="flex flex-col items-center my-2">
        <div class="form-control w-full">
          <div class="label">
            <span class="label-text">อีเมล</span>
          </div>
          <input v-model="email" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
          <div class="label">
            <span class="label-text">ชื่อ</span>
          </div>
          <input v-model="firstname" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
          <div class="label">
            <span class="label-text">นามสกุล</span>
          </div>
          <input v-model="lastname" type="text" placeholder="Type here" class="input input-bordered w-full" />
        </div>

        <div>
          <div class="flex justify-center">
            <p class="font-bold text-2xl mt-3">ที่อยู่</p>
          </div>
          <div class="mt-5">
            คุณยังไม่มีที่อยู่ <RouterLink to="/user/profile/address" class="btn btn-accent text-white font-light ml-2">เพิ่มตรงนี้เลย</RouterLink>
          </div>
        </div>

        <button @click="updateProfile" class="btn btn-neutral w-full mt-4">ยืนยันการเปลี่ยนข้อมูล</button>
      </div>
    </div>
  </UserLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import UserLayout from '~/layouts/userLayouts.vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const email = ref('');
const firstname = ref('');
const lastname = ref('');


const fetchCountries = async () => {
  try {
    const response = await import('~/assets/data/countries.json');
    countries.value = response.default;
  } catch (error) {
    console.error('Error fetching countries data:', error);
  }
};

const updateProfile = async () => {
  try {
    const response = await axios.put('/api/users/updateProfile', {
      userId: authStore.user.id,
      firstname: firstname.value,
      lastname: lastname.value,
      address: address.value,
    });

    if (response.data.success) {
      alert('Profile updated successfully');
      fetchUserProfile();
    } else {
      alert('Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating the profile');
  }
};



// Fetch provinces from API
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

// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    const response = await $fetch(`/api/users/?id=${authStore.user.id}`);

    if (response) {
      email.value = response.email || '';
      firstname.value = response.firstname || '';
      lastname.value = response.lastname || '';
      if (response.addresses && response.addresses.length > 0) {
        const userAddress = response.addresses[0];
        address.value = {
          ...userAddress,
        };
        // Set initial selections based on user profile
        if (address.value.province) {
          onProvinceChange();
        }
        if (address.value.district) {
          onDistrictChange();
        }
        if (address.value.subdistrict) {
          onSubdistrictChange(); // Call to set postal code
        }
      }
    } else {
      alert('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    alert('An error occurred while fetching the profile');
  }
};

// Fetch user profile and provinces on component mount
onMounted(async () => {
  fetchUserProfile();
  fetchProvinces();
  fetchCountries();
});
</script>
