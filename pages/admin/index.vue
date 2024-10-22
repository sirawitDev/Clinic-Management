<script setup>
import { ref, onMounted } from 'vue';
import adminLayouts from '~/layouts/adminLayout2.vue';
import { useUserStore } from '~/stores/user.ts';
import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const userStore = useUserStore();
const totalPatients = ref(0);
const payment = ref([]);
const totalRevenue = ref(0);
const reservations = ref([]);
const todayAppointments = ref(0);

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

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    todayAppointments.value = reservations.value.filter(
      (reservation) => formatDate(reservation.date) === today
    ).length; // Count today's appointments
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
};


const fetchPayments = async () => {
  try {
    const response = await fetch('/api/admin/payment', {
      method: 'GET',
    });
    const data = await response.json();
    payment.value = data.body;
    totalRevenue.value = payment.value.reduce((sum, p) => sum + p.totalAmount, 0);
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

// Delete a payment
const deletePayment = async (id) => {
  try {
    const response = await fetch(`/api/payment/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      payment.value = payment.value.filter((p) => p.id !== id);
      totalRevenue.value = payment.value.reduce((sum, p) => sum + p.totalAmount, 0);
    } else {
      console.error('Error deleting payment');
    }
  } catch (error) {
    console.error('Error deleting payment:', error);
  }
};

const deleteReservation = async (id) => {
  try {
    const response = await fetch(`/api/reservations?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting reservations: ${response.statusText}`);
    }
    await response.json();
    // Optionally, remove the deleted reservation from the reservations list
    reservations.value = reservations.value.filter((res) => res.id !== id);
  } catch (error) {
    console.error(error.message);
  }
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0]; // Return 'YYYY-MM-DD' format
};

definePageMeta({
  middleware: 'auth',
});

onMounted(async () => {
  await userStore.fetchUsers().then(() => {
    totalPatients.value = userStore.users.length;
  });
  await fetchPayments();
  await fetchReservations(); // Ensure reservations and todayAppointments are fetched correctly
});
</script>


<template>
  <adminLayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
      <h2 class="sm:text-6xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">DASHBOARD</h2>
    </div>
    <div class="flex justify-center mt-5 p-5 bg-white shadow-md rounded-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div class="card bg-[#2584FF] w-full shadow-xl h-44 transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-3xl pl-5 pt-5">รายได้ทั้งหมด</h2>
          <div class="flex mt-8">
            <div class="flex ml-5 w-full mt-8">
              <p class="text-white text-4xl mt-1">{{ totalRevenue }} บาท</p>
            </div>
            <div class=" absolute bottom-3 right-1 justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/users_391194.png" alt="logo_user" class="w-[75px]">
            </div>
          </div>
        </div>
        <div class="card bg-[#00AC97] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-3xl pl-5 pt-5">นัดหมายวันนี้</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5 mt-8">
              <p class="text-white text-4xl mt-2">{{ todayAppointments }} คน</p>
            </div>
            <div class="flex-1 flex justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/qc_8790314-1.png" alt="logo_user">
            </div>
          </div>
        </div>
        <!-- This section displays today's appointments count -->
        <div class="card bg-[#515262] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">รวมผู้ป่วยทั้งหมด</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5 mt-8">
              <p class="text-white text-4xl mt-2">{{ totalPatients }} คน</p>
              <!-- Correctly bound to todayAppointments -->
            </div>
            <div class="flex-1 flex justify-end mr-5">
              <img src="https://img2.pic.in.th/pic/job_10485121.png" alt="logo_user">
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="bg-white rounded-lg h-[400px] shadow-lg">
      <div class="bg-[#FF8128] rounded-t-lg h-14 flex justify-center items-center bg-opacity-95 shadow-sm">
        <h1 class="text-white text-3xl">
          นัดหมายวันนี้
        </h1>
      </div>
      <div class="grid sm:grid-cols-4 grid-cols-1 gap-3 p-4">
        <div v-for="(reservation, index) in reservations" :key="reservation.id" class="bg-base-100 rounded-xl mb-5 border-2 border-accent shadow-md">
          <div class="flex justify-center mt-4">
            <img src="https://img2.pic.in.th/pic/volunteer_11077481.png" alt="logo-user" class="w-16">
          </div>
          <div class="mt-2">
            <h1 class="text-center">ข้อมูลนัดหมาย</h1>
          </div>
          <div class="ml-4 mt-3 sm:text-sm text-[10px]">
            
            <h1 class="text-base">{{ reservation.email }}</h1>
            <h1 class="text-base">ชื่อ : {{ reservation.firstname }} {{ reservation.lastname }}</h1>
            <h1 class="text-base">วันนัด : {{ formatDate(reservation.date) }}</h1>
            <h1 class="text-base">เวลานัด : {{ reservation.time }}</h1>
            <h1 class="text-base">บัตรประชาชน : {{ reservation.cdnumber || 'N/A' }}</h1>

            <div class="flex gap-2 justify-center mb-2 mt-2">
              <button @click="deleteReservation(reservation.id)" class="btn sm:w-28 w-16 shadow-md bg-red-500 text-white">
                <Trash /> <p class="font-light hidden sm:block">ลบ</p>
              </button>
              <button class="btn btn-accent sm:w-28 w-16">
                <div class="flex">
                  <Edit />
                  <h1 class="font-light text-white mt-1 hidden sm:block">เพิ่มเติม</h1>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="bg-white rounded-lg h-96 mt-5">
      <div class="bg-[#FF8128] rounded-t-lg h-14 flex justify-center items-center bg-opacity-95">
        <h1 class="text-white text-3xl">
          รายการล่าสุด
        </h1>
      </div>
      <div class="overflow-x-auto mt-3">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>
                <p class="text-center">ID</p>
              </th>
              <th>
                <p class="text-center">ชื่อลูกค้า</p>
              </th>
              <th>
                <p class="text-center">ชื่อสินค้า</p>
              </th>
              <th>
                <p class="text-center">จ่ายแบบ</p>
              </th>
              <th>
                <p class="text-center">สถานะ</p>
              </th> <!-- Column for Status -->
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in payment" :key="payment.id">
              <td>
                <p class="text-center">{{ index + 1 }}</p>
              </td>
              <td>
                <div class="flex justify-center items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle h-12 w-12">
                      <img src="https://img2.pic.in.th/pic/volunteer_11077481.png"
                        alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                  <div>
                    <div class="font-light">
              <td>{{ payment.diagnosis?.patient?.firstname }} {{ payment.diagnosis?.patient?.lastname }}</td>
      </div>
    </div>
    </div>
    </td>
    <td>
      <p class="text-center">{{ payment.orderNumber }}</p>
    </td>
    <td>
      <p class="text-center">พร้อมเพย์</p>
    </td>
    <td>
      <p class="text-center">{{ payment.status }}</p>
    </td>
    <th>
      <div class="flex gap-2">
        <button @click="deletePayment(payment.id)" class="btn btn-md btn-danger font-light">
          <Trash />
        </button>
        <button class="btn btn-md btn-accent font-light text-white">เพิ่มเติม</button>
      </div>
    </th>
    </tr>
    </tbody>
    <!-- foot -->
    </table>
    </div>
    </div>

    <!-- <div class="flex gap-3">
      <div class="flex-1">
        <div class=" p-4 bg-white mt-5 shadow-md rounded-md">
          <div class="flex justify-center">
            <h1 class="text-3xl font-light">สรุปรายได้</h1>
          </div>
          <div class="mt-5">
            <ApexBarChart />
          </div>
        </div>
      </div>
      <div class="flex-1">

      </div>
    </div> -->
  </adminLayouts>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>