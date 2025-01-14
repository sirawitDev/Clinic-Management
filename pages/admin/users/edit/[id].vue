<template>
  <adminLayout>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else class="flex justify-center p-4">
      <form @submit.prevent="submitForm" class="w-full">
        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">ชื่อ</span>
          </div>
          <input type="text" v-model="form.firstname" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">นามสกุล</span>
          </div>
          <input type="text" v-model="form.lastname" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">อีเมล</span>
          </div>
          <input type="email" v-model="form.email" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">role</span>
          </div>
          <select class="select select-bordered" v-model="form.role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="cashier">Cashier</option>
          </select>
        </label>

        <div class="flex sm:justify-end justify-center gap-5">
          <RouterLink to="/admin/users" class="btn btn-accent font-light my-5 text-white sm:w-60 w-36">
            ย้อนกลับ
          </RouterLink>
          <div>
            <button type="submit" class="btn btn-accent my-5 text-white font-light sm:w-60 w-36">ยืนยันการแก้ไข</button>
          </div>
        </div>
      </form>
    </div>
  </adminLayout>
</template>

<script setup>
import adminLayout from '~/layouts/adminLayout2.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const loading = ref(true);

const form = ref({
  email: '',
  role: '',
  firstname: '',
  lastname: ''
});

const fetchUser = async (id) => {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const userData = await response.json();
    form.value = {
      email: userData.email,
      role: userData.role,
      firstname: userData.firstname,
      lastname: userData.lastname,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchUser(id);
  }
});

const submitForm = async () => {
  const id = route.params.id;

  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: "คุณต้องการอัปเดตข้อมูลผู้ใช้นี้หรือไม่?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, ฉันต้องการอัปเดต!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value),
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถอัปเดตผู้ใช้ได้');
      }

      Swal.fire({
        icon: 'success',
        title: 'อัปเดตสำเร็จ!',
        text: 'ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว',
      }).then(() => {
        router.push('/admin/users')
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้ กรุณาลองอีกครั้ง',
      });
      console.error('Error updating user:', error);
    }
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>
