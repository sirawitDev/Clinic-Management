<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const form = ref({
  title: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  about: '',
});

const fetchPhysician = async (id) => {
  try {
    const response = await axios.get(`/api/physician/${id}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch physician data');
    }
    form.value = response.data;
  } catch (error) {
    console.error('Error fetching physician:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

const submitForm = async () => {
  try {
    const updatedData = { ...form.value };

    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'บันทึก',
    });

    if (result.isConfirmed) {
      await axios.put(`/api/physician/${route.params.id}`, updatedData);

      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'การเปลี่ยนแปลงถูกบันทึกเรียบร้อยแล้ว',
      });

      router.push('/admin/physicians');
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถบันทึกการเปลี่ยนแปลงได้ กรุณาลองอีกครั้ง',
    });
    console.error('Failed to update physician:', error);
  }
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchPhysician(id);
  }
});

definePageMeta({
  middleware: 'auth',
});
</script>



<template>
  <AdminLayout>
    <div class="flex">
      <div class="flex-1 mt-4 pl-4">
        <div class="divider"></div>
      </div>
      <div class="flex-2">
        <h1 class="font-bold text-3xl p-4">แก้ไขข้อมูลแพทย์</h1>
      </div>
      <div class="flex-1 mt-4 pr-4">
        <div class="divider"></div>
      </div>
    </div>
    <div class="flex justify-center p-4">
      <form @submit.prevent="submitForm" class="w-full">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">คำนำหน้า</span>
          </div>
          <select class="select select-bordered" v-model="form.title">
            <option>นายแพทย์</option>
            <option>อื่นๆ</option>
          </select>
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">ชื่อ</span>
          </div>
          <input type="text" v-model="form.first_name" placeholder="Type here" class="input input-bordered w-full"
            required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">นามสกุล</span>
          </div>
          <input type="text" v-model="form.last_name" placeholder="Type here" class="input input-bordered w-full"
            required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">อีเมล</span>
          </div>
          <input type="email" v-model="form.email" placeholder="Type here" class="input input-bordered w-full"
            required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">หมายเลขโทรศัพท์</span>
          </div>
          <input type="tel" v-model="form.phone" placeholder="Type here" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">อื่นๆ</span>
          </div>
          <select class="select select-bordered" v-model="form.about">
            <option disabled selected>Pick one</option>
            <option>แพทย์</option>
            <option>แคชเชียร์</option>
            <option>พยาบาล</option>
          </select>
        </label>

        <div class="flex justify-end gap-5">
          <RouterLink to="/admin/physicians" class="btn btn-accent w-60 mt-5">
            <p class="text-white font-light">ย้อนกลับ</p>
          </RouterLink>
          <button type="submit" class="btn btn-secondary mt-5 w-60 text-white font-light">ยืนยันการแก้ไข</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Add your styles here if needed */
</style>