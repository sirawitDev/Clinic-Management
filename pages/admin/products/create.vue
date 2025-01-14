<script setup>
import adminLayouts from '~/layouts/adminLayout2.vue'
import Swal from 'sweetalert2';

const router = useRouter()

const name = ref('')
const imageUrl = ref('')
const price = ref('')
const quantity = ref('')
const about = ref('')
const status = ref('open')

const submitForm = async () => {
  const data = {
    name: name.value,
    imageUrl: imageUrl.value,
    price: parseInt(price.value),
    quantity: parseInt(quantity.value),
    about: about.value,
    status: status.value
  }

  // ใช้ SweetAlert2 เพื่อยืนยันก่อนการส่งข้อมูล
  const { isConfirmed } = await Swal.fire({
    title: 'ยืนยันการเพิ่มสินค้า',
    text: 'คุณต้องการเพิ่มสินค้านี้หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
  });

  // หากผู้ใช้ยืนยัน
  if (!isConfirmed) {
    return; // หยุดการดำเนินการหากยกเลิก
  }

  try {
    const response = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มสินค้าเรียบร้อย',
        text: 'สินค้าได้ถูกเพิ่มสำเร็จแล้ว',
      });

      // ย้ายไปหน้ารายการสินค้า
      router.push('/admin/products');
    } else {
      console.error('Error adding product:', result);
      Swal.fire({
        icon: 'error',
        title: 'เพิ่มสินค้าไม่สำเร็จ',
        text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่',
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดไม่คาดคิด โปรดลองใหม่',
    });
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="mb-4 flex justify-center">
        <div
          class="flex justify-center items-center bg-[#FF8128] sm:w-full w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
          <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลสินค้า</h2>
        </div>
      </div>

      <div class="max-w-2xl mx-auto bg-white rounded-md p-4 mt-5">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">ชื่อสินค้า</span>
          </div>
          <input v-model="name" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">รูปภาพ URL</span>
          </div>
          <input v-model="imageUrl" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Image Preview -->
        <div v-if="imageUrl" class="my-4">
          <div class="flex justify-center">
            <img :src="imageUrl" alt="" class="w-48 h-auto border rounded" />
          </div>
        </div>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">ราคา</span>
          </div>
          <input v-model="price" type="number" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">จำนวน</span>
          </div>
          <input v-model="quantity" type="number" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">คำอธิบายรายละเอียดสินค้า</span>
          </div>
          <input v-model="about" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">สถานะ</span>
          </div>
          <select v-model="status" class="select select-bordered">
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </label>

        <div class="flex justify-center mt-5 gap-5">
          <RouterLink to="/admin/products" class="btn btn-accent sm:w-60 w-40">
            <p class="font-light text-white text-base">ย้อนกลับ</p>
          </RouterLink>
          <button @click="submitForm" class="btn btn-accent sm:w-60 w-40 font-light text-white text-base">เพิ่มสินค้า</button>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>