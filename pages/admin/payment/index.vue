<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';
import Swal from 'sweetalert2';

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
    payment.value = data.body;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

const confirmPayment = async (id) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการยืนยันการชำระเงินนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, ยืนยัน!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'success' }),
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'การชำระเงินสำเร็จ!',
          text: 'การชำระเงินของคุณได้รับการยืนยันแล้ว',
        });
      } else {
        console.error('Failed to confirm payment');
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถยืนยันการชำระเงินได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน',
      });
    }
  }
};

const deletePayment = async (id) => {
  if (confirm('คุณต้องการลบการชำระเงินนี้หรือไม่?')) {
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

onMounted(async () => {
  await fetchPayments();
  console.log('payment :' , payment.value)
});

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <AdminLayout>
    <div class=" mx-auto p-4 bg-white">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">การชำระเงิน</h2>
      </div>

      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <table v-else class="table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center font-medium">ลำดับ</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อลูกค้า</p>
              </th>
              <th>
                <p class="text-center font-medium">สินค้า</p>
              </th>
              <th>
                <p class="text-center font-medium">ราคาทั้งหมด</p>
              </th>
              <th>
                <p class="text-center font-medium">จ่ายแบบ</p>
              </th>
              <th>
                <p class="text-center font-medium">สถานะ</p>
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
                <p class="text-center">{{ payment.diagnosis?.patient?.firstname }} {{
                  payment.diagnosis?.patient?.lastname }}</p>
              </td>
              <td>
                <div v-for="product in payment.products">
                  <p class="">{{ product.name }} จำนวน <span class="text-red-500">{{ product.quantity
                      }}</span>
                    ชิ้น</p>
                </div>
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
                  <button @click="deletePayment(payment.id)" class="btn bg-red-500 hover:bg-red-300">
                    <Trash />
                  </button>
                  <!-- <button class="btn btn-accent">
                    <p class="font-light text-white">ดูเพิ่มเติม</p>
                  </button> -->
                  <button v-if="payment.status === 'pending'" @click="confirmPayment(payment.id)"
                    class="btn btn-secondary">
                    <p class="font-light text-white">ยืนยันการชำระเงิน</p>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
