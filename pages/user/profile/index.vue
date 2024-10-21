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
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-4">

      <ProfileAside class="hidden sm:block" />


      <div class="flex-1 sm:p-5 p-0 sm:w-full w-[60%]">
        <div class="font-bold text-3xl flex justify-center mt-3">ข้อมูลส่วนตัว</div>

        <div class="flex w-full font-kanit mt-10">
          <div class=" w-52">
            <p class=" text-gray-500">ชื่อโปรไฟล์</p>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex-grow">

              <div v-if="!editingName">
                {{ firstname }} {{ lastname }}
              </div>

              <div v-else>
                <input v-model="firstname" type="text" placeholder="First name"
                  class="input input-bordered w-full mb-2" />
                <input v-model="lastname" type="text" placeholder="Last name" class="input input-bordered w-full" />
              </div>
            </div>

            <div class="ml-4">
              <!-- Edit button when not editing, Save/Cancel buttons when editing -->
              <p class="link link-secondary" v-if="!editingName" @click="toggleEditName">แก้ไข</p>
              <div v-else>
                <button @click="saveName" class="btn btn-primary btn-sm">บันทึก</button>
                <button @click="cancelEditName" class="btn btn-sm ml-2">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-full font-kanit mt-10">
          <div class=" w-52">
            <p class=" text-gray-500">เลขประชาชน</p>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex-grow">
              <div v-if="!editingCdNumber">
                {{ cdnumber }}
              </div>
              <div v-else>
                <input v-model="cdnumber" type="text" placeholder="cdnumber" class="input input-bordered w-full" />
              </div>
            </div>

            <div class="ml-4">
              <!-- Edit button when not editing, Save/Cancel buttons when editing -->
              <p class="link link-secondary" v-if="!editingCdNumber" @click="toggleEditCdNumber">แก้ไข</p>
              <div v-else>
                <button @click="saveCdNumber" class="btn btn-primary btn-sm">บันทึก</button>
                <button @click="cancelEditCdNumber" class="btn btn-sm ml-2">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>

        <div class=" divider"></div>

        <div class="flex w-full font-kanit mt-10">
          <div class=" w-52">
            <p class=" text-gray-500">อีเมล</p>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex-grow">
              {{ email }}
            </div>
          </div>
        </div>

        <div class=" divider"></div>

        <div class="flex w-full font-kanit mt-10">
          <div class="w-52">
            <p class="text-gray-500">เปลี่ยนรหัสผ่าน</p>
          </div>
          <div class="flex flex-col w-full">
            <input v-model="newPassword" type="password" placeholder="รหัสผ่านใหม่"
              class="input input-bordered w-full mb-2" />
            <input v-model="confirmPassword" type="password" placeholder="รหัสผ่านใหม่อีกครั้ง"
              class="input input-bordered w-full" />
            <div class="flex justify-between mt-4">
              <button @click="changePassword" class="btn btn-primary btn-sm">
                <p class="font-light">เปลี่ยนรหัสผ่าน</p>
              </button>
              <button @click="cancelPasswordChange" class="btn btn-sm ml-2">
                <p class="font-light">ยกเลิก</p>
              </button>
            </div>
          </div>
        </div>

        <div class=" divider"></div>

        <div class="flex w-full font-kanit mt-10" v-for="(address, index) in addresses" :key="address.id">
          <div class="w-52">
            <p class="text-gray-500">หมายเลขโทรศัพท์</p>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex-grow">
              <div v-if="!address.editingPhoneNumber">
                {{ address.phoneNumber }}
              </div>

              <div v-else>
                <input v-model="address.phoneNumber" type="text" placeholder="Phone number"
                  class="input input-bordered w-full" />
              </div>
            </div>

            <div class="ml-4">
              <!-- Edit button when not editing, Save/Cancel buttons when editing -->
              <p class="link link-secondary" v-if="!address.editingPhoneNumber" @click="toggleEditPhoneNumber(index)">
                แก้ไข</p>
              <div v-else>
                <button @click="savePhoneNumber(index)" class="btn btn-primary btn-sm">บันทึก</button>
                <button @click="cancelEditPhoneNumber(index)" class="btn btn-sm ml-2">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>



        <div class="items-center my-2">
          <button @click="updateProfile"
            class="btn btn-accent text-white sm:w-full w-full mt-5">ยืนยันการเปลี่ยนข้อมูล</button>
        </div>
      </div>
    </div>
  </UserLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import UserLayout from '~/layouts/userLayouts.vue';
import ProfileAside from '~/components/user/ProfileAside.vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const email = ref('');
const firstname = ref('');
const lastname = ref('');
const cdnumber = ref('')
const addresses = ref([])
const editingName = ref(false); // State to track editing mode
const editingCdNumber = ref(false);

const newPassword = ref('');
const confirmPassword = ref('');

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('New passwords do not match');
    return;
  }

  try {
    const response = await axios.put('/api/users/changePassword', {
      userId: authStore.user.id,
      newPassword: newPassword.value,
    });

    if (response.data.success) {
      alert('Password changed successfully');
      newPassword.value = '';
      confirmPassword.value = '';
    } else {
      alert(response.data.error || 'Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    alert('An error occurred while changing the password');
  }
};


const cancelPasswordChange = () => {
  newPassword.value = '';
  confirmPassword.value = '';
};


const toggleEditName = () => {
  editingName.value = !editingName.value;
};

const cancelEditName = () => {
  editingName.value = false;
  fetchUserProfile(); // Reset to original values
};

const saveName = async () => {
  await updateProfile(); // Update the profile with new values
  authStore.updateUserName(firstname.value, lastname.value); // Update store and localStorage
  editingName.value = false;
}

//cdnumber
const toggleEditCdNumber = () => {
  editingCdNumber.value = !editingCdNumber.value;
};

const cancelEditCdNumber = () => {
  editingCdNumber.value = false;
  fetchUserProfile(); // Reset to original values
};


const saveCdNumber = async () => {
  try {
    const response = await axios.put('/api/users/updateCdNumber', {
      userId: authStore.user.id,
      cdnumber: cdnumber.value,
    });

    if (response.data.success) {
      alert('CD number updated successfully');
      authStore.updateCdnumber(cdnumber.value);
      editingCdNumber.value = false;
    } else {
      alert('Failed to update CD number');
    }
  } catch (error) {
    console.error('Error updating CD number:', error);
    alert('An error occurred while updating the CD number');
  }
};

//Phone Fuc
const toggleEditPhoneNumber = (index) => {
  addresses.value[index].editingPhoneNumber = true;
};

const cancelEditPhoneNumber = (index) => {
  addresses.value[index].editingPhoneNumber = false;
  fetchAddresses(); // Re-fetch the addresses to reset to original values
};

const savePhoneNumber = async (index) => {
  const address = addresses.value[index];
  try {
    const response = await axios.put('/api/users/address', {
      addressId: address.id,
      phoneNumber: address.phoneNumber,
      houseNumber: address.houseNumber,
      village: address.village,
      subdistrict: address.subdistrict,
      district: address.district,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country
    });

    if (response.data.success) {
      alert('Phone number updated successfully');
      fetchAddresses();
    } else {
      alert('Failed to update phone number');
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
    alert('An error occurred while updating the phone number');
  }
};


const updateProfile = async () => {
  try {
    const response = await axios.put('/api/users/updateProfile', {
      userId: authStore.user.id,
      firstname: firstname.value,
      lastname: lastname.value,
      address: addresses.value,
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


// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    const response = await $fetch(`/api/users/?id=${authStore.user.id}`);

    if (response) {
      email.value = response.email || '';
      firstname.value = response.firstname || '';
      lastname.value = response.lastname || '';
      cdnumber.value = response.cdnumber || '';
    } else {
      alert('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    alert('An error occurred while fetching the profile');
  }
}

const fetchAddresses = async () => {
  try {
    const response = await axios.get(`/api/users/address?userId=${authStore.user.id}`);
    if (response.data.success) {
      addresses.value = response.data.addresses.map(address => ({
        ...address,
        editingPhoneNumber: false, // Initialize edit mode to false
      }));
    } else {
      alert('Failed to fetch addresses');
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
    alert('An error occurred while fetching addresses');
  }
};

authStore.initializeAuth()

onMounted(async () => {
  await fetchUserProfile();
  await fetchAddresses()

  console.log('user :', cdnumber.value)
});
</script>

<style scoped>
.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
