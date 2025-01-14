<template>
  <AdminLayout>
    <div class=" mx-auto p-4 bg-base-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการผู้ใช้บริการ</h2>
      </div>

      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
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
                <p class="text-center font-medium">อีเมล</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อ</p>
              </th>
              <th>
                <p class="text-center font-medium">นามสกุล</p>
              </th>
              <th>
                <p class="text-center font-medium">เลขบัตรประชาชน</p>
              </th>
              <th>
                <p class="text-center font-medium">Role</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <th>
                <p class="text-center">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</p>
              </th>
              <td>
                <p class="text-center">{{ user.email }}</p>
              </td>
              <td>
                <div v-if="user.firstname">
                  <p class="text-center">{{ user.firstname }}</p>
                </div>
                <div v-else>
                  <p class="text-red-400 text-center">ยังไม่ได้เพิ่ม</p>
                </div>
              </td>
              <td>
                <div v-if="user.lastname">
                  <p class="text-center">{{ user.lastname }}</p>
                </div>
                <div v-else>
                  <p class="text-red-400 text-center">ยังไม่ได้เพิ่ม</p>
                </div>
              </td>
              <td>
                <p v-if="user.cdnumber" class="text-center">{{ user.cdnumber }}</p>
                <p v-else class="text-center text-red-400 text-sm">ยังไม่ได้เพิ่ม</p>
              </td>
              <td>
                <p class="text-center">{{ user.role }}</p>
              </td>
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

      <div v-if="totalPages > 1" class="join mt-4 flex justify-center gap-2">
        <button v-for="page in totalPages" :key="page"
          :class="['join-item', 'btn', { 'btn-active': currentPage === page }]" @click="goToPage(page)">
          {{ page }}
        </button>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '~/layouts/adminLayout2.vue';
import Swal from 'sweetalert2';

import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const router = useRouter();
const isLoading = ref(true);
const useres = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(8);

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/admin/useres', {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    useres.value = await response.json();
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    isLoading.value = false;
  }
};

const deleteUser = async (email) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบผู้ใช้นี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '<span class="font-knit">ใช่, ลบเลย!</span>',
    cancelButtonText: '<span class="font-knit">ยกเลิก</span>',
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`/api/admin/useres?email=${email}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');

    Swal.fire('ลบสำเร็จ!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success');
    useres.value = useres.value.filter(user => user.email !== email);
  } catch (err) {
    console.error('Error deleting user:', err);
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบผู้ใช้ได้', 'error');
  }
};

const editUser = (id) => {
  router.push(`/admin/users/edit/${id}`);
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return useres.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(useres.value.length / itemsPerPage.value);
});

const goToPage = (page) => {
  currentPage.value = page;
};

definePageMeta({
  middleware: 'auth',
});

onMounted(fetchUser);
</script>

<style scoped>
.font-kanit {
  font-family: 'Kanit', sans-serif;
}


.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
