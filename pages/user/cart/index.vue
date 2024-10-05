<template>
  <userLayouts>
    <section class="bg-white py-8 antialiased bg-slate-200 md:py-16 rounded-xl">
      <div class="mx-auto max-w-screen-xl px-4">
        <div class="flex justify-center items-center">
          <h2 class="text-5xl mx-2 font-semibold text-gray-900">Shopping Cart</h2>
        </div>

        <div class="mt-6 sm:mt-10 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div class="space-y-6">

              <!-- Div 1 -->
              <div v-if="userCartStore.items.length === 0">
                คุณไม่มีสินค้าในตระกร้า
              </div>

              <div v-else v-for="(item, index) in userCartStore.items" :key="(item, index)"
                class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-base-700  md:p-6">
                <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 ">
                  <div class="flex bg-base-200 w-28 h-28 justify-center items-center rounded-lg">
                    <a href="#" class="shrink-0 md:order-1">
                      <img class="h-20 w-20 dark:hidden"
                        src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
                      <img class="hidden h-20 w-20 dark:block" :src="item.imageUrl" />
                    </a>
                  </div>

                  <label for="counter-input" class="sr-only">Choose quantity:</label>
                  <div class="flex items-end justify-end order-3">
                    <!-- Select -->
                    <div class="flex items-center justify-center">
                      <select v-model="item.quantity" class="select w-full" @change="changeQuantity($event, index)">
                        <option v-for="quantity in [1, 2, 3, 4, 5]" :key="quantity">
                          {{ quantity }}
                        </option>
                      </select>
                    </div>

                    <div class="text-end md:order-4 w-32 mx-3 my-2">
                      <p class="text-base font-bold text-gray-900 ">{{ item.price }} ฿</p>
                    </div>
                  </div>

                  <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <a href="#" class="text-base font-medium text-gray-900 hover:underline">{{
                      item.name }}</a>

                    <div class="flex items-center gap-4">
                      <button type="button" @click="toggleFavorite"
                        :class="['inline-flex items-center text-sm font-medium', isFavorite ? 'text-red-500' : 'text-gray-500', 'hover:text-gray-900 hover:underline dark:text-gray-400']">
                        <svg :class="['me-1.5 h-5 w-5', isFavorite ? 'heart-pulse' : '']" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path :stroke="isFavorite ? 'rgb(239, 68, 68)' : 'currentColor'" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2"
                            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                        </svg>
                        Add to Favorites
                      </button>

                      <!-- Remove Button-->

                      <button type="button"
                        class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                        @click="userCartStore.removeItemInCart(index)">
                        <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                          height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                        Remove
                      </button>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Div People also 1 -->
            <div class="hidden xl:mt-8 xl:block">
              <h3 class="text-3xl font-semibold text-gray-900 mx-2">People also bought</h3>

              <div class="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                <div v-for="item in [1, 2, 3]" :key="item"
                  class="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-base-700">
                  <a href="#" class="overflow-hidden rounded">
                    <img class="mx-auto h-44 w-44 dark:hidden"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
                    <img class="mx-auto hidden h-44 w-44 dark:block"
                      src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="imac image" />
                  </a>
                  <div>
                    <a href="#" class="text-lg font-semibold leading-tight text-gray-900 hover:underline ">iMac
                      27”</a>
                    <p class="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">This
                      generation has some
                      improvements, including a longer continuous battery life.</p>
                  </div>
                  <div>
                    <p class="text-lg font-bold text-gray-900 ">
                      <span class="line-through"> 399,99 ฿</span>
                    </p>
                    <p class="text-lg font-bold leading-tight text-red-600 dark:text-red-500">299 ฿
                    </p>
                  </div>
                  <div class="mt-6 flex justify-between gap-2.5">
                    <div class="my-2">
                      <LikeButton></LikeButton>
                    </div>
                    <button type="button"
                      class="inline-flex w-3/5 items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-[#3730a3] focus:outline-none focus:ring-4 focus:ring-[#a5b4fc] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca] dark:focus:ring-[#3730a3]">
                      <svg class="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                      </svg>
                      Add to cart
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Total -->

          <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div
              class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-base-200 dark:bg-base-700 sm:p-6">
              <p class="text-3xl font-semibold text-gray-900 text-center">Order summary</p>

              <div class="space-y-4">
                <div class="space-y-2">
                  <dl class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 ">ราคาสินค้า</dt>
                    <dd class="text-base font-medium text-gray-900 ">{{ userCartStore.summaryPrice
                      }} ฿
                    </dd>
                  </dl>

                  <!-- <dl class="flex items-center justify-between gap-4">
                                      <dt class="text-base font-normal text-gray-500 ">Savings</dt>
                                      <dd class="text-base font-medium text-green-600">-$299.00</dd>
                                  </dl> -->

                  <dl class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 ">ค่าส่ง</dt>
                    <dd class="text-base font-medium text-gray-900 ">0 ฿</dd>
                  </dl>

                  <dl class="flex items-center justify-between gap-4">
                    <dt class="text-base font-normal text-gray-500 ">ภาษี</dt>
                    <dd class="text-base font-medium text-gray-900 ">0 ฿</dd>
                  </dl>
                </div>

                <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt class="text-base font-bold text-gray-900 ">ราคาทั้งหมด</dt>
                  <dd class="text-base font-bold text-gray-900 ">{{ userCartStore.summaryPrice }} ฿
                  </dd>
                </dl>
              </div>

              <RouterLink to="/user/checkout"
                class="flex w-full items-center justify-center rounded-lg bg-[#4338ca] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3730a3] focus:outline-none focus:ring-4 focus:ring-[#a5b4fc] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca] dark:focus:ring-[#3730a3]">
                Proceed
                to Checkout</RouterLink>

              <div class="flex items-center justify-center gap-2">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
                <RouterLink to="/user/product" href="#" title=""
                  class="inline-flex items-center gap-2 text-sm font-medium text-[#4338ca] underline hover:no-underline dark:text-[#6366f1]">
                  Continue Shopping
                  <svg class="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
                </RouterLink>
              </div>
            </div>

            <div
              class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-base-200 dark:bg-base-700 sm:p-6">
              <form class="space-y-4">
                <div>
                  <label for="voucher" class="mb-2 block text-sm font-medium text-gray-900 "> Do you
                    have
                    a voucher or gift card? </label>
                  <input type="text" id="voucher"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-base-500 focus:border-[#6366f1] focus:ring-[#6366f1] dark:border-gray-600 dark:bg-base-700  dark:placeholder:text-gray-400 dark:focus:border-[#6366f1] dark:focus:ring-[#6366f1]"
                    placeholder="" required />
                </div>
                <button type="submit"
                  class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3730a3] focus:outline-none focus:ring-4 focus:ring-[#a5b4fc] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca] dark:focus:ring-[#3730a3]">Apply
                  Code</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </userLayouts>
</template>

<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import LikeButton from "~/components/user/LikeButton.vue";

import { useUserCartStore } from "@/stores/users/cart";

const userCartStore = useUserCartStore()

const hover = ref(false);
const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const changeQuantity = (event, index) => {
  const newQuantity = parseInt(event.tarhet.value)
  userCartStore.updateQuantity(index, newQuantity)
}
</script>

<style></style>