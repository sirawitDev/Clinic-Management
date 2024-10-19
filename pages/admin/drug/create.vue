<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลยา</h2>
      </div>
      <div class="bg-white rounded-md p-4 mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-4 ">
          <div>
            <label for="name" class="block text-base font-medium">ชื่อยา</label>
            <input v-model="name" id="name" type="text" required class="input input-bordered w-full" />
          </div>

          <div>
            <label for="imageUrl" class="block text-base font-medium">URL รูปภาพ</label>
            <input v-model="imageUrl" id="imageUrl" type="text" class="input input-bordered w-full" />
          </div>

          <!-- Image Preview -->
          <div v-if="imageUrl" class="my-4">
            <div class="flex justify-center">
              <img :src="imageUrl" alt="" class="w-48 h-auto border rounded" />
            </div>
          </div>

          <div>
            <label for="type" class="block text-base font-medium">ประเภทของยา</label>
            <select v-model="type" id="type" class="select select-bordered w-full" required>
              <option value="ยาสามัญประจำบ้าน">ยาสามัญประจำบ้าน</option>
              <option value="ยาใส่แผล/นวด/ใช้ภายนอก">ยาใส่แผล/นวด/ใช้ภายนอก</option>
              <option value="ยาน้ำสำหรับเด็ก">ยาน้ำสำหรับเด็ก</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>

          <!-- ช่อง input จะปรากฏเมื่อเลือก "อื่นๆ" -->
          <div v-if="type === 'อื่นๆ'">
            <label for="customType" class="block text-base font-medium">ประเภทอื่นๆ</label>
            <input v-model="customType" id="customType" type="text" placeholder="กรุณาระบุประเภท"
              class="input input-bordered w-full input-accent" />
          </div>

          <div>
            <label for="price" class="block text-base font-medium">ราคา</label>
            <input v-model.number="price" id="price" type="number" required class="input input-bordered w-full" />
          </div>
          <div>
            <label for="dosage" class="block text-base font-medium">ปริมาณยา</label>
            <input v-model.number="dosage" id="dosage" type="number" step="0.01" class="input input-bordered w-full" />
          </div>

          <div>
            <label for="unit" class="block text-base font-medium">หน่วยของปริมาณ</label>
            <select v-model="unit" id="unit" class="select select-bordered w-full">
              <option value="mg">มิลลิกรัม (mg)</option>
              <option value="g">กรัม (g)</option>
              <option value="ml">มิลลิลิตร (ml)</option>
              <option value="tablet">เม็ด (tablet)</option>
              <option value="bottle">ขวด (bottle)</option>
              <!-- Add more options as needed -->
            </select>
          </div>

          <div>
            <label for="about" class="block text-base font-medium">ข้อมูลเพิ่มเติมเกี่ยวกับสินค้า</label>
            <textarea v-model="about" id="about" class="textarea textarea-bordered w-full"></textarea>
          </div>

          <div class="form-control">
            <div class="label">
              <span class="label-text text-base">Status</span>
            </div>
            <select class="select select-bordered" v-model="status">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div class="flex justify-center gap-5 mt-0">
            <RouterLink to="/admin/drug" class="btn btn-accent font-light text-white mt-5 sm:w-60 w-32">ย้อนกลับ</RouterLink>
            <div class="w-60 mt-5 mb-10">
              <button @click="submitForm" class="btn btn-accent sm:w-60 w-32 text-white font-light">เพิ่มข้อมูลยา</button>
            </div>
          </div>
        </form>
      </div>
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

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
