<template>
  <cashierLayouts>
    <div class="container mx-auto p-4 bg-white max-w-5xl">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">รายการการชำระเงิน</h2>
      </div>

      <div class="overflow-x-auto mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table mt-5">
          <thead>
            <tr>
              <th>
                <p class="text-center">ID</p>
              </th>
              <th>
                <p class="text-center">ชื่อลูกค้า</p>
              </th>
              <th>
                <p class="text-center">หมายเลขสินค้า</p>
              </th>
              <th>
                <p class="text-center">ราคาทั้งหมด</p>
              </th>
              <th>
                <p class="text-center">จ่ายแบบ</p>
              </th>
              <th>
                <p class="text-center">สถานะ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, index) in payment" :key="payment.id">
              <td>
                <p class="text-center">{{ index + 1 }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.diagnosis?.patient?.firstname }} {{ payment.diagnosis?.patient?.lastname }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.orderNumber }}</p>
              </td>
              <td>
                <p class="text-center">{{ payment.totalAmount }} บาท</p>
              </td>
              <td>
                <p class="text-center">{{ payment.paymentMethod }}</p>
              </td>
              <td>
                <p v-if="payment.status === 'pending'" class="text-center">กำลังรอ</p>
                <p v-else class="text-center">เสร็จสิ้น</p>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button @click="deletePayment(payment.id)" class="btn">
                    <Trash />
                  </button>
                  <button class="btn btn-accent">
                    <p class="font-light text-white">ดูเพิ่มเติม</p>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </cashierLayouts>
</template>

<script setup>
import cashierLayouts from '~/layouts/cashierLayouts.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'


const isLoading = ref(true);
const router = useRouter();

const payment = ref([]);

const fetchPayments = async () => {
  try {
    const response = await fetch('/api/payment', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('Payments:', data);
    payment.value = data.body;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

const deletePayment = async (id) => {
  if (confirm('Are you sure you want to delete this payment?')) {
    try {
      const response = await fetch(`/api/payment?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        payment.value = payment.value.filter(p => p.id !== id);
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  }
};

onMounted(() => {
  fetchPayments();
});
</script>

<style>

</style>