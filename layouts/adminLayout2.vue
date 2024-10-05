<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center mt-2">
      <nav class="w-full mt-2 ml-4 mr-4 bg-slate-600 p-4 flex justify-between items-center rounded-2xl h-14">
        <div class="flex">
          <RouterLink to="/admin" class="flex justify-center items-center">
            <img class=" w-32 h-[48px]" src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png"
              alt="logo" />
          </RouterLink>
          <div class="flex">
            <h1 class="font-bold text-2xl mt-2 ml-2 text-white">Admin</h1>
            <h1 class="font-bold text-2xl mt-2 ml-2 text-white">Dashboard</h1>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a class="justify-between">
                  ออกจากระบบ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <div class="flex h-full mt-2 ml-4">
      <!-- Sidebar / Aside -->
      <aside class="w-72 bg-slate-500 rounded-xl h-full">
        <div class="w-full h-26 bg-slate-600 rounded-t-xl flex justify-center items-center p-4">
          <!-- <RouterLink to="/admin" class="flex justify-center items-center">
            <img class="w-[180px] h-[70px]" src="https://img5.pic.in.th/file/secure-sv1/AIRPORT-removebg-preview.png"
              alt="logo" />
          </RouterLink> -->
          <div class="flex-col justify-center items-center">
            <div class="flex justify-center items-center avatar">
              <div class=" ring-accent ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div class="flex">
              <h1 class="mt-2 text-base-200">Role :</h1>
              <h1 class="font-bold ml-2 mt-2 text-accent">Super Admin</h1>
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
                    <p class="text-base ">ข้อมูลแพทย์</p>
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
      <div class="flex-1 p-4 bg-zinc-100 rounded-xl mx-1 h-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
* {
  font-family: 'Kanit', sans-serif;
}
</style>
