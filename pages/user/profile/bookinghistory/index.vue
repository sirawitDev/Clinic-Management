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
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5">
      <ProfileAside class="hidden sm:block"/>

      <div class="flex-1 p-5 w-full">
        <div class="font-bold text-3xl flex justify-center">ประวัติการจอง</div>

        <div class="overflow-x-auto p-4">
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
                  <p class="text-center">วัน / เวลา</p>
                </th>
                <th>
                  <p class="text-center">อื่นๆ</p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reservation , index) in reservations" :key="reservation.id">
                <td>
                  <p class="text-center">{{ reservation.firstname }} {{ reservation.lastname }}</p>
                </td>
                <td>
                  <p class="text-center">{{ reservation.email }}</p>
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
                <td class="">
                  <!-- <div class="flex justify-center">
                    <div class="btn btn-accent font-light text-white">ดูเพิ่มเติม</div>
                  </div> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script lang="ts" setup>
import ProfileAside from '~/components/user/ProfileAside.vue';
import UserLayout from '~/layouts/userLayouts.vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore()
const reservations = ref([])

const fetchReservations = async () => {
  try {
    const response = await fetch('/api/reservations', {
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD' format
};

authStore.initializeAuth()

onMounted(async() => {
  await fetchReservations()
  console.log('rever : ' , reservations.value)
})
</script>

<style>

</style>