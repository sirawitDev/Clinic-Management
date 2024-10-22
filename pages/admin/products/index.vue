<script setup>
import { ref, onMounted, computed } from 'vue'
import adminLayouts from '~/layouts/adminLayout2.vue'

const products = ref([])
const selectedProduct = ref(null)
const ToggleTitle = ref(false)

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/product')
    const result = await response.json()
    if (response.ok) {
      products.value = result
    } else {
      console.error('Error fetching products:', result)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch('/api/product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (response.ok) {
        products.value = products.value.filter(product => product.id !== id)
        alert('Product deleted successfully')
      } else {
        console.error('Error deleting product:', result)
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred')
    }
  }
}

const truncateText = (text, length = 20) => {
  if (text.length > length) {
    return text.slice(0, length) + '...'
  }
  return text
}

const openModal = (product) => {
  selectedProduct.value = { ...product }
}

const closeModal = () => {
  selectedProduct.value = null
}

const ToggleClick = () => {
  ToggleTitle.value = !ToggleTitle.value  // Update the reactive property
}

onMounted(() => {
  fetchProducts()
})

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <adminLayouts>
    <div class="bg-white w-full h-full p-2 pt-3 shadow-md rounded-md mt-5">
      <div class="mb-4 flex justify-center">
        <div
          class="flex justify-center items-center bg-[#FF8128] sm:w-full w-full h-20 shadow-md rounded-full bg-opacity-50">
          <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">จัดการข้อมูลสินค้า</h2>
        </div>
      </div>
      <div class="mt-5 flex justify-center">
        <nuxt-link to="/admin/products/create"
          class="btn btn-accent w-full font-light text-white">เพิ่มข้อมูลสินค้า</nuxt-link>
      </div>
      <div class="mx-auto p-2 mt-5">

        <!-- <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>id</th>
                <th>รูปภาพ</th>
                <th>ชื่อสินค้า</th>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>
                  <p class="text-center">about</p>
                </th>
                <th>
                  <p class="text-center"></p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <th>{{ product.id }}</th>
                <th><img class="w-24 h-24" :src="product.imageUrl" alt="pic"></th>
                <td>{{ product.name }}</td>
                <td>
                  <div :class="['badge', product.status === 'open' ? 'badge-success' : 'badge-error', 'pb-1']">
                    <p class="text-white">{{ product.status }}</p>
                  </div>
                </td>
                <td>{{ product.quantity }} / {{ product.remainQuantity }}</td>
                <td>
                  <p class="text-center">{{ truncateText(product.about) }}</p>
                </td>
                <td>
                  <div class="flex justify-center gap-2">
                    <button @click="deleteProduct(product.id)" class="btn btn-accent text-white font-light">ลบ</button>
                    <button class="btn btn-accent text-white font-light">แก้ไข</button>
                    <button @click="openModal(product)"
                      class="btn btn-accent text-white font-light">ดูเพิ่มเติม</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id"
            class="card h-[450px] w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <figure class="w-full h-48 overflow-hidden rounded-lg">
              <img :src="product.imageUrl" alt="product image"
                class=" w-[200px] h-[200px] object-cover transition-transform duration-500 hover:scale-105" />
            </figure>
            <div class="card-body">
              <h2 class="card-title">{{ product.name }}</h2>
              <p>Status :
                <span
                  :class="{ 'text-green-500': product.status === 'open', 'text-red-500': product.status !== 'open' }">
                  {{ product.status }}
                </span>
              </p>
              <p class="mt-1">จำนวน: {{ product.quantity }} / {{ product.remainQuantity }}</p>
              <p class="mt-1">{{ truncateText(product.about) }}</p>
              <div class="card-actions justify-center mt-4">
                <button @click="deleteProduct(product.id)" class="btn btn-error text-white">ลบ</button>
                <button @click="openModal(product)" class="btn btn-primary text-white">ดูเพิ่มเติม</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>


    <!-- Modal Overlay -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg relative sm:w-[55%] w-[80%] max-h-[70%] flex flex-col overflow-hidden">
        <!-- Header with close button -->
        <div class="p-4 flex justify-center items-center bg-orange-300 sticky top-0 z-10 relative">
          <div>
            <h3 class="sm:text-4xl text-2xl font-bold text-white">ข้อมูลเพิ่มเติม</h3>
          </div>
          <div class="absolute right-4 top-4">
            <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost text-white">✕</button>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="overflow-y-auto p-4">
          <div class="flex">
            <div class="flex-2 p-4 hidden sm:block">
              <div class="avatar flex justify-center">
                <div class="w-48 rounded">
                  <img :src="selectedProduct.imageUrl" alt="product image" />
                </div>
              </div>
            </div>
            <div class="flex-1 p-4">
              <div>
                <h1 class="font-bold text-2xl sm:text-left text-center">รายละเอียดสินค้า</h1>
              </div>
              <div class="mt-4">
                <div class=" sm:hidden avatar flex justify-center">
                  <div class="w-48 rounded">
                    <img :src="selectedProduct.imageUrl" alt="product image" />
                  </div>
                </div>
                <p><strong class="text-gray-600">ชื่อสินค้า:</strong> {{ selectedProduct.name }}</p>

                <div class="flex gap-2">
                  <p class="mt-2"><strong class="text-gray-600">สถานะ:</strong></p>

                  <div :class="['badge', selectedProduct.status === 'close' ? 'badge-error' : 'badge-success']"
                    class="sm:mt-2 mt-3 mr-1">
                    <p class="text-white sm:text-base text-[14px]">{{ selectedProduct.status }}</p>
                  </div>
                </div>

                <p class="mt-2"><strong class="text-gray-600">จำนวน:</strong> {{ selectedProduct.quantity }} / {{
                  selectedProduct.remainQuantity }}</p>
                <p class="mt-2"><strong class="text-gray-600">รายละเอียด:</strong> {{ selectedProduct.about }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </adminLayouts>
</template>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
</style>