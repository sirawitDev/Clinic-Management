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
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5 sm:h-full h-full">
      <ProfileAside class="hidden sm:block" />

      <div class="flex-1 p-5 w-full font-kanit">
        <div class=" text-3xl flex flex-col justify-center gap-5">
          <div class="flex justify-center">
            <div
              class="flex justify-center items-center bg-[#FF8128] sm:w-[60%] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
              <h2 class="sm:text-4xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">ประวัติการจอง</h2>
            </div>
          </div>
          
          <!-- <div class="flex justify-center">
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">
                  <p class="font-light text-base">ค้นหาตามบัตรประชาชน</p>
                </span>
              </div>
              <input type="text" placeholder="ค้นหาตามบัตรประชาชน" class="input input-bordered w-full max-w-xs"
                v-model="searchCdnumber" />
            </label>
          </div>
          <div class="flex justify-center">
            <div class="btn btn-accent w-36" @click="handleSearch">
              <p class="text-white font-light">ค้นหา</p>
            </div>
          </div> -->
        </div>

        <div class="overflow-x-auto p-4 mt-2">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <p class="text-center">รายชื่อ</p>
                </th>
                <th>
                  <p class="text-center">รายการตรวจ</p>
                </th>
                <th>
                  <p class="text-center">วัน / เวลา</p>
                </th>
                <th>
                  <p class="text-center">อื่นๆ</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reservation, index) in reservations" :key="reservation.id">
                <td>
                  <p class="text-center">{{ reservation.firstname }} {{ reservation.lastname }}</p>
                </td>
                <td>
                  <p class="text-center">{{ reservation.category }}</p>
                </td>
                <td>
                  <p class="text-center">{{ formatDate(reservation.date) }} / {{ reservation.time }}</p>
                </td>
                <td>
                  <p class="text-center">{{ reservation.note }}</p>
                </td>
                <td class=""></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- <div>
          <div class="flex justify-center">
            <div
              class="flex justify-center items-center bg-[#FF8128] sm:w-[60%] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
              <h2 class="sm:text-4xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">รายการค้นหา</h2>
            </div>
          </div>
          <div class="overflow-x-auto p-4 mt-2">
            <table class="table">
              <thead>
                <tr>
                  <th>
                    <p class="text-center">รายชื่อ</p>
                  </th>
                  <th>
                    <p class="text-center">อีเมล</p>
                  </th>
                  <th>
                    <p class="text-center">รายการตรวจ</p>
                  </th>
                  <th>
                    <p class="text-center">เลขบัตรประชาชน</p>
                  </th>
                  <th>
                    <p class="text-center">วัน / เวลา</p>
                  </th>
                  <th>
                    <p class="text-center">อื่นๆ</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(searchResult, index) in searchResults" :key="index">
                  <td>
                    <p class="text-center">{{ searchResult.firstname }} {{ searchResult.lastname }}</p>
                  </td>
                  <td>
                    <p class="text-center">{{ searchResult.email }}</p>
                  </td>
                  <td>
                    <p class="text-center">{{ searchResult.category }}</p>
                  </td>
                  <td>
                    <p class="text-center">{{ searchResult.cdnumber }}</p>
                  </td>
                  <td>
                    <p class="text-center">{{ formatDate(searchResult.date) }} / {{ searchResult.time }}</p>
                  </td>
                  <td>
                    <p class="text-center">{{ searchResult.note }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->
      </div>
    </div>
  </UserLayout>
</template>

<script lang="ts" setup>
import ProfileAside from '~/components/user/ProfileAside.vue';
import UserLayout from '~/layouts/userLayouts.vue';
import { useAuthStore } from '~/stores/auth';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const reservations = ref([]);
const searchCdnumber = ref(''); // Variable to store the input cdnumber
const searchResults = ref([]); // Array to store search results

const fetchReservationsByCdnumber = async (cdnumber) => { // Accept cdnumber as parameter
  try {
    const response = await fetch(`/api/users/reservations/${cdnumber}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
    const data = await response.json();
    reservations.value = data.reservations; // Assuming API returns an array of reservations
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
};

const handleSearch = async () => {
  if (searchCdnumber.value) {
    await fetchReservationsByCdnumber(searchCdnumber.value); // Fetch reservations based on searched cdnumber
    searchResults.value = reservations.value; // Update search results with fetched data
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD' format
};

authStore.initializeAuth();
onMounted(async () => {
  await authStore.initializeAuth();
  await fetchReservationsByCdnumber(authStore.user.cdnumber); // Fetch initial reservations
  console.log('user : ', authStore.user.cdnumber);
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
