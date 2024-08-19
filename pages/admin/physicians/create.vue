<template>
  <AdminLayout>
    <div class="flex">
      <div class="flex-1 mt-4 pl-4">
        <div class="divider"></div>
      </div>
      <div class="flex-2">
        <h1 class="font-bold text-3xl p-4">เพิ่มข้อมูลแพทย์</h1>
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
          <input type="text" v-model="form.first_name" placeholder="Type here" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">นามสกุล</span>
          </div>
          <input type="text" v-model="form.last_name" placeholder="Type here" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">อีเมล</span>
          </div>
          <input type="email" v-model="form.email" placeholder="Type here" class="input input-bordered w-full" required />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">หมายเลขโทรศัพท์</span>
          </div>
          <input type="tel" v-model="form.phone" @input="formatPhoneNumber" placeholder="080-000-0000" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full mt-3">
          <div class="label">
            <span class="label-text">อื่นๆ</span>
          </div>
          <input type="text" v-model="form.about" placeholder="Type here" class="input input-bordered w-full" />
        </label>

        <div>
          <button type="submit" class="btn btn-accent my-5 w-full text-white font-light">ยืนยันข้อมูล</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '~/layouts/adminLayouts.vue'
import { usePhysicianStore } from '~/stores/physicianStore'

const physicianStore = usePhysicianStore()
const router = useRouter()

const form = ref({
  title: 'นายแพทย์',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  about: ''
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
  try {
    const userData = { ...form.value }
    await physicianStore.addPhysician(userData)
    router.push('/admin/physicians')
  } catch (error) {
    alert('Failed to create physician')
    console.error(error)
  }
}
</script>