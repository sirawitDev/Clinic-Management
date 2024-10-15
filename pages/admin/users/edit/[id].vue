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

        <div class="flex justify-end gap-5">
          <RouterLink to="/admin/users" class="btn btn-accent font-light my-5 text-white w-60">
            ย้อนกลับ
          </RouterLink>
          <div>
            <button type="submit" class="btn btn-accent my-5 text-white font-light w-60">ยืนยันการแก้ไข</button>
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
  console.log(form.value)
  if (id) {
    fetchUser(id); // Fetch user details using the ID from route params
  }
});

const submitForm = async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    router.push('/admin/users'); // Redirect back to the user list after successful update
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>
