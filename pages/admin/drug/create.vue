<template>
  <adminLayouts>
    <div class="container mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-5 bg-opacity-50">
        <h2 class="sm:text-5xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลยา</h2>
      </div>
      <div class="bg-white rounded-md p-4 mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-4 ">
          <div>
            <label for="name" class="block text-base font-medium">ชื่อยา</label>
            <input v-model="name" id="name" type="text" required class="input input-bordered w-full" />
          </div>

          <div>
            <label for="image" class="block text-base font-medium">รูปภาพ</label>
            <input type="file" id="image" @change="handleFileChange" accept="image/*"
              class="file-input file-input-bordered w-full" />
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="my-4">
            <div class="flex justify-center">
              <img :src="imagePreview" alt="" class="w-48 h-auto border rounded" />
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
            <RouterLink to="/admin/drug" class="btn btn-accent font-light text-white mt-5 sm:w-60 w-32 text-base">ย้อนกลับ
            </RouterLink>
            <div class="w-60 mt-5 mb-10">
              <button @click="submitForm"
                class="btn btn-accent sm:w-60 w-32 text-white font-light text-base">เพิ่มข้อมูลยา</button>
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
import Swal from 'sweetalert2';

const name = ref('')
const type = ref('ยาสามัญประจำบ้าน')
const customType = ref('')
const price = ref('')
const dosage = ref('')
const unit = ref('')
const about = ref('')
const status = ref('active')
const imageFile = ref(null)
const imagePreview = ref('')

const router = useRouter()

watch(type, (newType) => {
  if (newType !== 'อื่นๆ') {
    customType.value = ''
  }
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const submitForm = async () => {
  const finalType = type.value === 'อื่นๆ' ? customType.value : type.value;

  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('type', finalType);
  formData.append('dosage', dosage.value);
  formData.append('price', price.value);
  formData.append('unit', unit.value);
  formData.append('status', status.value);
  formData.append('about', about.value);

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการเพิ่มยานี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, เพิ่มเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/drug', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'เพิ่มยาเรียบร้อยแล้ว',
        });
        router.push('/admin/drug');
      } else {
        console.error('Error adding drug:', result);
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเพิ่มยาได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาดไม่คาดคิด',
        text: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

onUnmounted(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})

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
