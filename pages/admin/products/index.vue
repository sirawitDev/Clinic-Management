<script setup>
import { ref, onMounted, computed } from 'vue'
import adminLayouts from '~/layouts/adminLayout2.vue'
import Swal from 'sweetalert2';

const products = ref([])
const selectedProduct = ref(null)
const ToggleTitle = ref(false)
const isLoading = ref(true)

const fetchProducts = async () => {
  isLoading.value = true
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
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: 'ยืนยันการลบสินค้า',
    text: 'คุณต้องการลบสินค้านี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch('/api/product', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (response.ok) {
      products.value = products.value.filter(product => product.id !== id);

      Swal.fire({
        icon: 'success',
        title: 'สินค้าถูกลบเรียบร้อย',
        text: 'สินค้าของคุณถูกลบสำเร็จ',
      });
    } else {
      console.error('Error deleting product:', result);
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถลบสินค้าได้',
        text: 'ไม่สามารถลบสินค้า กรุณาลองใหม่',
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดไม่คาดคิด โปรดลองใหม่',
    });
  }
};

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
        <!-- Show loading indicator -->
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-accent"></span>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div class="p-2 flex justify-center items-center bg-orange-300 sticky top-0 z-10 relative">
          <div>
            <h3 class="sm:text-2xl text-xl font-bold text-white">ข้อมูลเพิ่มเติม</h3>
          </div>
          <div class="absolute right-4 top-4">
            <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost text-white">✕</button>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="overflow-y-auto p-4">
          <div class="flex">

            <div class="flex items-center">
              <div class="flex-2 p-4 hidden sm:block">
                <div class="avatar flex justify-center border-2 rounded-xl shadow-md">
                  <div class="w-48 rounded">
                    <img :src="selectedProduct.imageUrl" alt="product image" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-1 p-4">
              <div class="flex justify-center">
                <h1 class="font-semibold text-3xl sm:text-left text-center">รายละเอียดสินค้า</h1>
              </div>

              <div class="divider"></div>

              <div class="mt-4">
                <div class=" sm:hidden avatar flex justify-center">
                  <div class="w-48 rounded">
                    <img :src="selectedProduct.imageUrl" alt="product image" />
                  </div>
                </div>

                <div class="flex">
                  <div class="flex-1">
                    <p class="text-gray-600 font-semibold">ชื่อสินค้า</p>
                  </div>
                  <div class="flex-1">
                    <p>{{ selectedProduct.name }}</p>
                  </div>
                </div>

                <div class="flex gap-2 mt-4">
                  <div class="flex-1">
                    <p class="text-gray-600 font-semibold">สถานะ</p>
                  </div>

                  <div class="flex-1">
                    <div :class="['badge', selectedProduct.status === 'close' ? 'badge-error' : 'badge-success']"
                      class=" mr-1">
                      <p class="text-white sm:text-base text-[14px]">{{ selectedProduct.status }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex mt-4">
                  <div class="flex-1">
                    <p class=" text-gray-600 font-semibold">จำนวน</p>
                  </div>
                  <div class="flex-1">
                    <p>{{ selectedProduct.quantity }} / {{ selectedProduct.remainQuantity }}</p>
                  </div>
                </div>

                <div class="flex mt-4">
                  <div class="w-[200px]">
                    <p class=" text-gray-600 font-semibold">รายละเอียด</p>
                  </div>
                  <p>{{ selectedProduct.about }}</p>
                </div>

                <div class="border-[1px] mt-3"></div>
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