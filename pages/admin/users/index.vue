<template>
  <AdminLayout>
    <div class="container mx-auto p-4 bg-base-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการผู้ใช้บริการ</h2>
      </div>

      <div class="overflow-x-auto mt-5">
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
                <p class="text-center">อีเมล</p>
              </th>
              <th>
                <p class="text-center">ชื่อ</p>
              </th>
              <th>
                <p class="text-center">นามสกุล</p>
              </th>
              <th>
                <p class="text-center">เลขบัตรประชาชน</p>
              </th>
              <th>
                <p class="text-center">Role</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in useres" :key="user.id">
              <th>
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td>
                <p class="text-center">{{ user.email }} {{ user.id }}</p>
              </td>
              <td><p class="text-center">{{ user.firstname }}</p></td>
              <td><p class="text-center">{{ user.lastname }}</p></td>
              <td>
                <p v-if="user.cdnumber" class="text-center">{{ user.cdnumber }}</p>
                <p v-else class="text-center text-red-400 text-sm">ยังไม่ได้เพิ่มเลขบัตร</p>
              </td>
              <td><p class="text-center">{{ user.role }}</p></td>
              <td>
                <div class="flex gap-2 justify-center">
                  <button class="btn" @click="deleteUser(user.email)">
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

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';

import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const router = useRouter();
const isLoading = ref(true);
const useres = ref([]); // เก็บข้อมูลผู้ใช้

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/admin/useres', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    useres.value = await response.json();
  } catch (err) {
    console.error('Error fetching promotions:', err);
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async (email) => {
  const confirmed = confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?');
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/admin/useres?email=${email}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    // ลบผู้ใช้จากรายการ useres ในหน้านี้
    useres.value = useres.value.filter(user => user.email !== email);
  } catch (err) {
    console.error('Error deleting user:', err);
  }
};

const editUser = (id) => {
  router.push(`/admin/users/edit/${id}`); // Navigate to the edit page with the user's ID
};


definePageMeta({
  middleware: 'auth',
});

onMounted(async() => {
  await fetchUser()
})
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
