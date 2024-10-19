<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center mt-2">
      <nav class="w-full mt-2 ml-4 mr-4 bg-slate-600 p-4 flex justify-between items-center rounded-2xl h-14">
        <div class="flex">
          <RouterLink to="/admin" class="flex justify-center items-center hidden sm:block">
            <img class=" w-32 h-[48px]" src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png"
              alt="logo" />
          </RouterLink>
          <div class=" hidden sm:block">
            <div class="flex">
              <h1 class="font-bold text-2xl mt-2 ml-2 text-white">Admin</h1>
              <h1 class="font-bold text-2xl mt-2 ml-2 text-white">Dashboard</h1>
            </div>
          </div>

          <button class="sm:hidden btn btn-ghost btn-circle text-white" @click="toggleMobileNav">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Sidebar for Mobile Navigation -->
          <div v-if="mobileNavOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
            @click="toggleMobileNav">
            <div class="absolute left-0 top-0 h-full w-60 bg-white font-kanit p-2 overflow-auto" @click.stop>
              <img class="pr-4 pl-4 pt-4" src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png"
                alt="logo" />
              <div class="divider pr-4 pl-4"></div>
              <ul class="flex flex-col">
                <li class="">
                  <RouterLink to="/admin" class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
                    @click="toggleMobileNav">
                    <p class="text-center text-orange-400 font-bold">DASHBOARD</p>
                  </RouterLink>
                </li>
                <!-- <li class="mt-2">
                  <RouterLink to="/user/promotion" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                    @click="toggleMobileNav">
                    โปรโมชั่น</RouterLink>
                </li>
                <li class="mt-2">
                  <RouterLink to="/user/product" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                    @click="toggleMobileNav">สินค้า
                  </RouterLink>
                </li>
                <li class="mt-2">
                  <RouterLink to="/user/about" class="block py-2 px-4 hover:bg-gray-200 rounded-full"
                    @click="toggleMobileNav">
                    เกี่ยวกับเรา</RouterLink>
                </li> -->
              </ul>

              <!-- ข้อมูลภายในเว็บ -->

              <ul class="menu bg-base-100 rounded-box w-70 mt-2 border-2 -mx-0 border-accent">
                <li>
                  <h2 class="menu-title font-light text-zinc-500 text-center text-base">ข้อมูลภายในเว็บ</h2>
                  <ul>
                    <li>
                      <RouterLink to="/admin/users" class="">
                        <font-awesome-icon :icon="['fa', 'user']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลยูสเซอร์</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/products">
                        <font-awesome-icon :icon="['fa', 'box-open']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลสินค้า</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/promotion">
                        <font-awesome-icon :icon="['fa', 'tags']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลโปรโมชั่น</p>
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>

              <!-- ข้อมูลภายในคลินิค -->
              <ul class="menu bg-base-100 rounded-box w-70 mt-2 border-2 -mx-0 border-accent">
                <li>
                  <h2 class="menu-title font-light text-zinc-500 text-center text-base">ข้อมูลภายในคลินิค</h2>
                  <ul>
                    <li>
                      <RouterLink to="/admin/patients" class="">
                        <font-awesome-icon :icon="['fa', 'user-injured']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลผู้ป่วย</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/physicians">
                        <font-awesome-icon :icon="['fa', 'user-md']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">บุคลากรในคลินิก</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/drug">
                        <font-awesome-icon :icon="['fa', 'pills']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลยา</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/course">
                        <font-awesome-icon :icon="['fa', 'chalkboard-teacher']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">ข้อมูลคอร์ส</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/admin/payment">
                        <font-awesome-icon :icon="['fa', 'credit-card']"
                          class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                        <p class="text-base ">การชำระเงิน</p>
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>

              <!-- การตรวจรักษา -->
              <ul class="menu bg-base-100 rounded-box w-70 mt-2 mb-2 border-2 -mx-0 border-accent">
                <li>
                  <h2 class="menu-title font-light text-zinc-500 text-center text-base">ตรวจรักษา</h2>
                  <ul>
                    <li>
                      <RouterLink to="/admin/information">
                        <font-awesome-icon :icon="['fas', 'folder-open']" class="text-zinc-500 text-xl" />
                        <p class="sm:text-base text-[15px]">ข้อมูลการตรวจ</p>
                      </RouterLink>
                    </li>
                    <li>
                      <details open>
                        <summary class="flex items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                          <font-awesome-icon icon="heartbeat" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                          <p class="text-base text-zinc-600">รักษา</p>
                        </summary>
                        <ul class="pl-4">
                          <li>
                            <RouterLink to="/admin/historytaking"
                              class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                              ซักประวัติ</RouterLink>
                          </li>
                          <li v-if="historyTakingCompleted">
                            <RouterLink to="/admin/checktreat"
                              class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                              ตรวจรักษา</RouterLink>
                          </li>
                        </ul>
                      </details>
                    </li>

                    <li>
                      <details open>
                        <summary class="flex items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                          <font-awesome-icon icon="search" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                          <p class="text-base text-zinc-600">ตรวจ</p>
                        </summary>
                        <ul class="pl-4">
                          <li>
                            <RouterLink to="/admin/waitcheck"
                              class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                              รอตรวจ</RouterLink>
                          </li>
                          <li>
                            <RouterLink to="/admin/checksuccess"
                              class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                              ตรวจเสร็จแล้ว</RouterLink>
                          </li>
                        </ul>
                      </details>
                    </li>

                  </ul>
                </li>

              </ul>

            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4 ">
          <RouterLink to="/user" class="btn btn-secondary btn-sm hidden sm:block">
            <p class="text-white font-light mt-2">ไปหน้ายูสเซอร์</p>
          </RouterLink>
          <RouterLink to="/Cashier" class="btn btn-secondary btn-sm hidden sm:block">
            <p class="text-white font-light mt-2">ไปหน้าแคชเชียร์</p>
          </RouterLink>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text text-white sm:text-sm text-[12px]">เปิดร้าน - ปิดร้าน</span>
              <input type="checkbox" class="toggle toggle-accent mx-2" :checked="ToggleOpenClose"
                @change="toggleStore" />
            </label>
          </div>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component"
                  src="https://img5.pic.in.th/file/secure-sv1/software-engineerc1438b6fade78e82.png" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a class="justify-between" @click="authStore.logout()">
                  ออกจากระบบ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="flex h-full mt-2">
      <!-- Sidebar / Aside -->
      <aside class="w-72 bg-slate-500 rounded-xl h-full hidden sm:block mx-4">
        <div class="w-full h-26 bg-slate-600 rounded-t-xl flex justify-center items-center p-4">
          <!-- <RouterLink to="/admin" class="flex justify-center items-center">
            <img class="w-[180px] h-[70px]" src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png"
              alt="logo" />
          </RouterLink> -->
          <div class="flex-col justify-center items-center">
            <div class="flex justify-center items-center avatar">
              <div class=" ring-accent ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                <img src="https://img5.pic.in.th/file/secure-sv1/software-engineerc1438b6fade78e82.png" />
              </div>
            </div>
            <div class="flex">
              <h1 class="mt-2 text-base-200">Role :</h1>
              <h1 class="font-bold ml-2 mt-2 text-accent">{{ authStore.user.role }}</h1>
            </div>
          </div>
          <div class="divider p-2"></div>
        </div>


        <div class="pr-2 pl-2">
          <RouterLink to="/admin"
            class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <font-awesome-icon :icon="['fa', 'tachometer-alt']" class="text-zinc-500 text-xl ml-2"></font-awesome-icon>
            <p class="text-base text-zinc-600 ml-2">Dashboard </p>
          </RouterLink>

          <ul class="menu bg-base-100 rounded-box w-70 mt-2">
            <li>
              <h2 class="menu-title font-light text-zinc-500 text-center text-base">ข้อมูลภายในเว็บ</h2>
              <ul>
                <li>
                  <RouterLink to="/admin/users" class="">
                    <font-awesome-icon :icon="['fa', 'user']" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลยูสเซอร์</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/products">
                    <font-awesome-icon :icon="['fa', 'box-open']"
                      class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลสินค้า</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/promotion">
                    <font-awesome-icon :icon="['fa', 'tags']" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลโปรโมชั่น</p>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="menu bg-base-100 rounded-box w-70 mt-2">
            <li>
              <h2 class="menu-title font-light text-zinc-500 text-center text-base">ข้อมูลภายในคลินิค</h2>
              <ul>
                <li>
                  <RouterLink to="/admin/patients" class="">
                    <font-awesome-icon :icon="['fa', 'user-injured']"
                      class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลผู้ป่วย</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/physicians">
                    <font-awesome-icon :icon="['fa', 'user-md']" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">บุคลากรในคลินิก</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/drug">
                    <font-awesome-icon :icon="['fa', 'pills']" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลยา</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/course">
                    <font-awesome-icon :icon="['fa', 'chalkboard-teacher']"
                      class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">ข้อมูลคอร์ส</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/payment">
                    <font-awesome-icon :icon="['fa', 'credit-card']"
                      class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                    <p class="text-base ">การชำระเงิน</p>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="menu bg-base-100 rounded-box w-70 mt-2 mb-2">
            <li>
              <h2 class="menu-title font-light text-zinc-500 text-center text-base">ตรวจรักษา</h2>
              <ul>
                <li>
                  <RouterLink to="/admin/information">
                    <font-awesome-icon :icon="['fas', 'folder-open']" class="text-zinc-500 text-xl mr-2" />
                    <p class="text-base ">ข้อมูลการตรวจ</p>
                  </RouterLink>
                </li>
                <li>
                  <details open>
                    <summary class="flex items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                      <font-awesome-icon icon="heartbeat" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                      <p class="text-base text-zinc-600">รักษา</p>
                    </summary>
                    <ul class="pl-4">
                      <li>
                        <RouterLink to="/admin/historytaking"
                          class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                          ซักประวัติ</RouterLink>
                      </li>
                      <li v-if="historyTakingCompleted">
                        <RouterLink to="/admin/checktreat"
                          class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                          ตรวจรักษา</RouterLink>
                      </li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details open>
                    <summary class="flex items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                      <font-awesome-icon icon="search" class="text-zinc-500 text-xl mr-2"></font-awesome-icon>
                      <p class="text-base text-zinc-600">ตรวจ</p>
                    </summary>
                    <ul class="pl-4">
                      <li>
                        <RouterLink to="/admin/waitcheck"
                          class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                          รอตรวจ</RouterLink>
                      </li>
                      <li>
                        <RouterLink to="/admin/checksuccess"
                          class="text-base text-zinc-600 hover:bg-gray-100 block p-2 rounded transition-colors duration-200">
                          ตรวจเสร็จแล้ว</RouterLink>
                      </li>
                    </ul>
                  </details>
                </li>

              </ul>
            </li>

          </ul>
        </div>
      </aside>
      <!-- Main Content -->
      <div class="flex-1 p-4  rounded-xl mx-auto w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminDashboardStore } from '~/stores/admin/dashboard';
import { storeToRefs } from "pinia";
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const AdminDashboardStore = useAdminDashboardStore();
const { ToggleOpenClose } = storeToRefs(AdminDashboardStore);
const mobileNavOpen = ref(false);

const toggleStore = () => {
  if (ToggleOpenClose.value) {
    AdminDashboardStore.closeStore();
  } else {
    AdminDashboardStore.openStore();
  }
};

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};


authStore.initializeAuth()
</script>

<style scoped>
* {
  font-family: 'Kanit', sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
