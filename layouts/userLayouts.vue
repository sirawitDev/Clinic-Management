<template>
  <div class=" container mx-auto">
    <div
      class="navbar bg-base-100 mb-5 bg-[#FAFAFA] rounded-full my-3 shadow-lg sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div class="flex-1 mx-3">
        <RouterLink to="/home" class="btn btn-ghost text-xl rounded-full">AIRPORT CLINIC</RouterLink>
      </div>

      <div class="mx-5 menu">
        <ul class="flex items-center">
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/home">หน้าแรก</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/promotion">โปรโมชั่น</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/product">สินค้า</RouterLink>
          </li>
          <li class="mx-4 sm:mx-2">
            <RouterLink to="/about">เกี่ยวกับเรา</RouterLink>
          </li>
        </ul>
      </div>

      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div tabindex="0" class="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
            <div class="card-body">
              <span class="text-lg font-bold">8 ชิ้น</span>
              <span class="text-info">ยอดทั้งหมด: $999</span>
              <div class="card-actions">
                <button class="btn btn-primary btn-block">ดูตระกร้า</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a class="justify-between">
                โปรไฟล์
              </a>
            </li>
            <li><a>ตั้งค่า</a></li>
            <li><a>ออกจากระบบ</a></li>
          </ul>
        </div>
      </div>
    </div>

    <slot></slot>

    <div class="hero mt-5 rounded-lg mb-5" style="
        background-image: url(https://img.freepik.com/premium-photo/interior-house-apartment-dining-3d-architecture-inside-hall-white-floor-generative-ai_163305-172769.jpg?w=826);
        ">
      <div class="hero-overlay rounded-lg"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold text-white">ติดต่อเรา</h1>
          <p class="mb-5 text-white">
            คลินิกสุขภาพ ความงาม และศัลยกรรม
            โบท็อกซ์ ฟิลเลอร์ ร้อยไหม วิตามินผิว
            เปิดบริการทุกวัน 11.00 - 20.00
          </p>
          <!-- Social-->
          <div class="flex space-x-2 justify-center opacity-75">
            <!-- Instagram -->
            <button>
              <Location></Location>
            </button>
            <!-- Twitter -->
            <button>
              <Call></Call>
            </button>
            <!-- Facebook -->
            <button>
              <svg
                height="36"
                width="36"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="text-blue-700">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351c0 .729.597 1.324 1.325 1.324h11.491v-9.284h-3.117v-3.622h3.117V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.463.099 2.795.143v3.241l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.324-.595 1.324-1.324V1.325C24 .597 23.404 0 22.675 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Location from '../components/user/Location.vue';
import Call from '../components/user/Call.vue';
</script>