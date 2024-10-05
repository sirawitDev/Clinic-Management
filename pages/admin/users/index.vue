<template>
  <AdminLayout>
    <div class="container mx-auto p-4 bg-base-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการผู้ใช้บริการ</h2>
      </div>

      <div class="mb-5">
        <nuxt-link to="/admin/physicians/create" class="btn btn-accent w-full text-white font-light mt-5">เพิ่มข้อมูล</nuxt-link>
      </div>

      <div class="overflow-x-auto">
        <!-- Display Loading message if data is still loading -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <!-- Display table once data is fetched -->
        <table v-else class="table">
          <thead>
            <tr>
              <th>
                <p class="text-center">ID</p>
              </th>
              <th>
                <p class="text-center">Email</p>
              </th>
              <th>
                <p class="text-center">Password</p>
              </th>
              <th>
                <p class="text-center">Name</p>
              </th>
              <th>
                <p class="text-center">Role</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <th>{{ index + 1 }}</th>
              <td>{{ user.email }}</td>
              <td>
                <div class="flex justify-center">
                  <span class="text-gray-500">••••••</span> <!-- Placeholder for password -->
                </div>
              </td>
              <td>{{ user.name }}</td>
              <td><p class="text-center">{{ user.role }}</p></td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deleteUser(user.id)">
                    <Trash />
                  </button>
                  <button class="btn btn-accent" @click="editUser(user.id)">
                    <Edit />
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const users = ref([]);
const isLoading = ref(true);
const router = useRouter();
const error = ref(null);

const fetchUsers = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    users.value = await response.json();
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = "Error fetching users.";
  } finally {
    isLoading.value = false; // Set loading to false
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`/api/users?id=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    await fetchUsers();
  } catch (err) {
    error.value = err.message;
  }
};

const editUser = (userId) => {
  router.push(`/admin/users/edit/${userId}`);
};

onMounted(fetchUsers);
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
  font-size: small;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
