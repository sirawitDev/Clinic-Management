<script setup>
import adminLayouts from '~/layouts/adminLayouts.vue'

const router = useRouter()

const name = ref('')
const imageUrl = ref('')
const price = ref('')
const quantity = ref('')
const about = ref('')
const status = ref('open')

const submitForm = async () => {
  const data = {
    name: name.value,
    imageUrl: imageUrl.value,
    price: parseInt(price.value),
    quantity: parseInt(quantity.value),
    about: about.value,
    status: status.value
  }

  try {
    const response = await fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      alert('Product added successfully')
      router.push('/admin/products')
    } else {
      console.error('Error adding product:', result)
      alert('Failed to add product')
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('An unexpected error occurred')
  }
}
</script>

<template>
  <adminLayouts>
    <div class="mx-auto p-4">
      <div class="mb-4">
        <div class="flex">
          <div class="flex-1 mt-4">
            <div class="divider"></div>
          </div>
          <div class="flex-2">
            <h1 class="font-bold text-3xl p-4">เพิ่มข้อมูลสินค้า</h1>
          </div>
          <div class="flex-1 mt-4">
            <div class="divider"></div>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">ชื่อสินค้า</span>
          </div>
          <input v-model="name" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">รูปภาพ URL</span>
          </div>
          <input v-model="imageUrl" type="text" placeholder="" class="input input-bordered w-full" />
        </label>

        <!-- Image Preview -->
        <div v-if="imageUrl" class="my-4">
          <div class="flex justify-center">
            <img :src="imageUrl" alt="" class="w-48 h-auto border rounded"/>
          </div>
        </div>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">ราคา</span>
          </div>
          <input v-model="price" type="number" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">จำนวน</span>
          </div>
          <input v-model="quantity" type="number" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">คำอธิบายรายละเอียดสินค้า</span>
          </div>
          <input v-model="about" type="text" placeholder="" class="input input-bordered w-full"/>
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">สถานะ</span>
          </div>
          <select v-model="status" class="select select-bordered">
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </label>

        <button @click="submitForm" class="btn btn-primary mt-4 w-full">Add Product</button>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>

</style>