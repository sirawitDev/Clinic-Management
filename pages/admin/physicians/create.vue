<template>
  <AdminLayout>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
        <h2 class="sm:text-5xl text-2xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มบุคลากรภายในคลินิก</h2>
      </div>
      <div class="rounded-md p-4 mt-5 bg-white">
        <form @submit.prevent="submitForm" class="w-full">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-medium text-base">คำนำหน้า</span>
            </div>
            <select class="select select-bordered" v-model="form.title">
              <option value="นายแพทย์">นายแพทย์</option>
              <option value="นาย">นาย</option>
              <option value="นาย">นาง</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </label>

          <!-- ช่อง input ปรากฏเมื่อเลือก "อื่นๆ" -->
          <div v-if="form.title === 'อื่นๆ'" class="mt-3">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">คำนำหน้า (อื่นๆ)</span>
              </div>
              <input type="text" v-model="customTitle" placeholder="กรุณาระบุคำนำหน้า"
                class="input input-bordered w-full" />
            </label>
          </div>

          <label class="form-control w-full mt-3">
            <div class="label">
              <span class="label-text font-medium text-base">ชื่อ</span>
            </div>
            <input type="text" v-model="form.first_name" placeholder="ชื่อ" class="input input-bordered w-full"
              required />
          </label>

          <label class="form-control w-full mt-3">
            <div class="label">
              <span class="label-text font-medium text-base">นามสกุล</span>
            </div>
            <input type="text" v-model="form.last_name" placeholder="นามสกุล" class="input input-bordered w-full"
              required />
          </label>

          <label class="form-control w-full mt-3">
            <div class="label">
              <span class="label-text font-medium text-base">อีเมล</span>
            </div>
            <input type="email" v-model="form.email" placeholder="อีเมล" class="input input-bordered w-full" required />
          </label>

          <label class="form-control w-full mt-3">
            <div class="label">
              <span class="label-text font-medium text-base">หมายเลขโทรศัพท์</span>
            </div>
            <input type="tel" v-model="form.phone" @input="formatPhoneNumber" placeholder="เบอร์โทรศัพท์"
              class="input input-bordered w-full" />
          </label>

          <label class="form-control w-full mt-3">
            <div class="label">
              <span class="label-text font-medium text-base">ตำแหน่ง</span>
            </div>
            <select class="select select-bordered" v-model="form.about">
              <option value="หมอ">หมอ</option>
              <option value="พยาบาล">พยาบาล</option>
              <option value="แคชเชียร์">แคชเชียร์</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </label>

          <div class="flex justify-end gap-5">
            <RouterLink to="/admin/physicians" class="btn btn-accent mt-5 text-base font-light text-white sm:w-60 w-36">ย้อนกลับ
            </RouterLink>
            <button type="submit" class="btn btn-accent mt-5 text-base text-white font-light sm:w-60 w-36">
              ยืนยันข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '~/layouts/adminLayout2.vue'
import { usePhysicianStore } from '~/stores/physicianStore'
import Swal from 'sweetalert2';

const physicianStore = usePhysicianStore()
const router = useRouter()

const form = ref({
  title: 'นายแพทย์',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  about: 'หมอ'
})

const customTitle = ref('')

watch(() => form.value.title, (newVal) => {
  if (newVal !== 'อื่นๆ') {
    customTitle.value = ''
  }
})

const formatPhoneNumber = (event) => {
  let input = event.target.value.replace(/\D/g, '').substring(0, 10)
  let formatted = input

  if (input.length > 6) {
    formatted = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`
  } else if (input.length > 3) {
    formatted = `${input.substring(0, 3)}-${input.substring(3, 6)}`
  }

  event.target.value = formatted
  form.value.phone = formatted
}

const submitForm = async () => {
  const finalTitle = form.value.title === 'อื่นๆ' ? customTitle.value : form.value.title;

  const userData = {
    ...form.value,
    title: finalTitle,
  };

  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการเพิ่มข้อมูลบุคลากรภายในคลินิกนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, เพิ่มเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      await physicianStore.addPhysician(userData);

      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'ข้อมูลบุคลากรภายในคลินิกถูกเพิ่มเรียบร้อยแล้ว',
      });

      router.push('/admin/physicians');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเพิ่มข้อมูลบุคลากรภายในคลินิกได้ กรุณาลองอีกครั้ง',
      });
      console.error('Failed to create physician:', error);
    }
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>

<style scope>

.container {
  max-width: 600px;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
