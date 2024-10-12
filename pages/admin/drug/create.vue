<template>
  <adminLayouts>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">เพิ่มข้อมูลยา</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium">ชื่อยา</label>
          <input v-model="name" id="name" type="text" required class="input input-bordered w-full" />
        </div>
        <div>
          <label for="type" class="block text-sm font-medium">ประเภทของยา</label>
          <select v-model="type" id="type" class="select select-bordered w-full" required>
            <option value="ยาสามัญประจำบ้าน">ยาสามัญประจำบ้าน</option>
            <option value="ยาใส่แผล/นวด/ใช้ภายนอก">ยาใส่แผล/นวด/ใช้ภายนอก</option>
            <option value="ยาน้ำสำหรับเด็ก">ยาน้ำสำหรับเด็ก</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>

        <!-- ช่อง input จะปรากฏเมื่อเลือก "อื่นๆ" -->
        <div v-if="type === 'อื่นๆ'">
          <label for="customType" class="block text-sm font-medium">ประเภทอื่นๆ</label>
          <input v-model="customType" id="customType" type="text" placeholder="กรุณาระบุประเภท" class="input input-bordered w-full" />
        </div>

        <div>
          <label for="price" class="block text-sm font-medium">ราคา</label>
          <input v-model.number="price" id="price" type="number" required class="input input-bordered w-full" />
        </div>
        <div>
          <label for="dosage" class="block text-sm font-medium">ปริมาณยา</label>
          <input v-model.number="dosage" id="dosage" type="number" step="0.01" class="input input-bordered w-full" />
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-medium">URL รูปภาพ</label>
          <input v-model="imageUrl" id="imageUrl" type="text" class="input input-bordered w-full" />
        </div>
        <div>
          <label for="unit" class="block text-sm font-medium">หน่วยของปริมาณ</label>
          <input v-model="unit" id="unit" type="text" class="input input-bordered w-full" />
        </div>
        <div>
          <label for="about" class="block text-sm font-medium">ข้อมูลเพิ่มเติม</label>
          <textarea v-model="about" id="about" class="textarea textarea-bordered w-full"></textarea>
        </div>

        <div class="flex justify-between gap-5 mt-0">
          <div class="form-control w-72">
            <div class="label">
              <span class="label-text">Status</span>
            </div>
            <select class="select select-bordered" v-model="status">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div class="w-full mt-9 mb-10">
            <button @click="submitForm" class="btn btn-accent w-full text-white">เพิ่มข้อมูลยา</button>
          </div>
        </div>
      </form>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import adminLayouts from '~/layouts/adminLayout2.vue'

const name = ref('')
const type = ref('ยาสามัญประจำบ้าน') // Default value
const customType = ref('') // สำหรับกรอกประเภทอื่นๆ
const price = ref('')
const dosage = ref('')
const imageUrl = ref('')
const unit = ref('')
const about = ref('')
const status = ref('active')

const router = useRouter()

// Watch เมื่อ type เปลี่ยน
watch(type, (newType) => {
  if (newType !== 'อื่นๆ') {
    customType.value = '' // เคลียร์ค่าเมื่อไม่ได้เลือก "อื่นๆ"
  }
})

const submitForm = async () => {
  const finalType = type.value === 'อื่นๆ' ? customType.value : type.value

  const data = {
    name: name.value,
    type: finalType, // ใช้ finalType ในการบันทึกประเภท
    dosage: parseInt(dosage.value),
    imageUrl: imageUrl.value,
    price: parseInt(price.value),
    unit: unit.value,
    status: status.value,
    about: about.value,
  }
  console.log('data', data)

  try {
    const response = await fetch('/api/drug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      alert('Drug added successfully')
      router.push('/admin/drug')
    } else {
      console.error('Error adding product:', result)
      alert('Failed to add drug')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('An unexpected error occurred')
  }
}

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
