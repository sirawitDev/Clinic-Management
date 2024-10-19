<script setup>
import { ref, onMounted } from 'vue';
import { useAdminDashboardStore } from '~/stores/admin/dashboard';
import { useAuthStore } from '~/stores/auth';

const AdminDashboardStore = useAdminDashboardStore();
const authStore = useAuthStore();

const statusStore = ref('');

onMounted(() => {
    if (AdminDashboardStore.ToggleOpenClose) {
        statusStore.value = 'เปิดร้าน';
    } else {
        statusStore.value = 'ปิดร้าน';
    }

    authStore.initializeAuth();

    console.log('user : ', authStore.user)
});
</script>

<template>
    <div class="hero sm:h-screen h-[500px] rounded-lg bg-opacity-90 mx-1"
        style="background-image: url(https://img2.pic.in.th/pic/file-hlrGqoYKwViJigphm4CFBz1j.png);">
        <div class="hero-overlay bg-opacity-50 rounded-lg bg-orange-100"></div>
        <div class="hero-content text-center text-neutral-content">
            <div class="flex flex-col bg-[#FF8128] bg-opacity-70 rounded-lg sm:h-[420px] h-[350px] w-11/12 justify-between items-center mx-auto">
                <div class="bg-orange-300 shadow-md bg-opacity-80 rounded-t-lg rounded-b-lg">
                    <div class="mt-2 mb-5 text-3xl md:text-5xl font-bold text-white font-kanit">
                        <p class="mt-5 text-stroke">แอร์พอร์ต เมดิคอล คลินิก</p>
                    </div>
                </div>
                <div class="mb-5 mt-5 text-center bg-orange-300 bg-opacity-70 shadow-md p-5 rounded-md">
                    <p class="text-white text-sm md:text-lg font-kanit">คลินิกสุขภาพ ความงาม และศัลยกรรม</p>
                    <p class="text-white text-sm md:text-lg font-kanit">โบท็อกซ์ ฟิลเลอร์ ร้อยไหม วิตามินผิว</p>
                    <p class="text-white text-sm md:text-lg font-kanit">เปิดบริการทุกวัน 11.00 - 20.00</p>
                </div>
                <div class="flex flex-col">
                    <div>
                        <RouterLink to="/user/reservation"
                            class="btn bg-orange-500 hover:-translate-y-1 rounded-md shadow-md hover:shadow-lg active:shadow-inner h-14 sm:w-48 w-20 hover:bg-slate-50 hover:bg-opacity-50"
                            role="button"
                            v-if="authStore.user.email.length > 1"
                            >
                            <span class="relative z-10 text-white font-light sm:text-lg text-sm">จองคิวออนไลน์</span>
                        </RouterLink>

                        <RouterLink to=""
                            class="btn bg-orange-500 hover:-translate-y-1 rounded-md shadow-md hover:shadow-lg active:shadow-inner h-12 sm:w-48 w-24 hover:bg-slate-50 hover:bg-opacity-50"
                            role="button"
                            v-else-if="authStore.user.email.length < 1"
                            onclick="my_modal_3.showModal()"
                            >
                            <span class="relative z-10 text-white font-light sm:text-lg text-sm">เข้าสู่ระบบ</span>
                        </RouterLink>
                    </div>
                </div>
                <div class="flex justify-center mt-3 w-full bg-orange-300 h-11 bg-opacity-80 rounded-b-lg shadow-md">
                    <p class="text-white text-center sm:mt-2 mt-1">สถานะ : </p>
                    <div :class="statusStore === 'เปิดร้าน' ? 'badge badge-success' : 'badge badge-error'"
                        class="mt-2 mx-2 sm:h-7 h-5 w-20">
                        <p class="text-white">{{ statusStore }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overflow-auto {
    overflow-y: auto;
}

.font-kanit {
    font-family: 'Kanit', sans-serif;
}

.text-stroke {
    text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
