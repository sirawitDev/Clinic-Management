<template>
    <UserLayout>
        <div
            class="flex flex-col max-w-5xl mx-auto border border-base-200 shadow-xl justify-center items-center rounded-xl bg-white">
            <div class="flex items-center justify-between bg-opacity-80 bg-[#FF8128] rounded-t-lg h-14 px-4 w-full">
                <RouterLink to="/user" class="btn btn-sm btn-primary text-white  font-light">กลับสู่หน้าหลัก
                </RouterLink>
                <h2 class="font-kanit text-stroke text-4xl text-white font-bold mx-auto">การจองคิว</h2>
            </div>
            <div class="w-full my-5 flex items-center justify-center">
                <ul class="steps">
                    <li v-for="(step, index) in steps" :key="index"
                        :class="['step', { 'step-primary': index < currentStep }]">
                        {{ step }}
                    </li>
                </ul>
            </div>

            <!-- หน้าเลือกหมวดหมู่ -->
            <div v-if="currentStep === 1" class="flex flex-col items-center justify-center w-full">
                <div class="grid grid-cols-2 gap-2 w-full h-full p-4" style="grid-template-columns: 1fr 2fr;">
                    <div class=" bg-opacity-5 bg-teal-800 rounded-md shadow-lg">
                        <!-- <div class="flex flex-col justify-center items-center mt-5">
                          <div class="avatar">
                              <div class="w-24 rounded">
                                  <img
                                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                              </div>
                          </div>
                      </div> -->
                        <!-- Your name-->
                        <div class="p-8">
                            <div v-for="form in formData" :key="form.field" class="form-control w-full">
                                <div class="label">
                                    <span class="label-text text-lg">{{ form.name }}</span>
                                </div>
                                <input v-if="form.field !== 'cdnumber'" type="text" placeholder=""
                                    class="input input-bordered w-full" v-model="useFormData[form.field]" />
                                <input v-else type="text" placeholder="" class="input input-bordered w-full"
                                    v-model="useFormData.cdnumber"
                                    @input="useFormData.cdnumber = $event.target.value.replace(/[^0-9]/g, '')"
                                    pattern="[0-9]*" inputmode="numeric" maxlength="13"
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center shadow-lg rounded-md">
                        <p class="text-2xl font-bold">หมวดหมู่</p>
                        <label class="form-control w-full max-w-xs mt-5">
                            <select class="select select-bordered" v-model="useFormData.category">
                                <option disabled selected>กรุณาเลือก</option>
                                <option>ตรวจทั่วไป</option>
                                <option>เสริมความงาม</option>
                                <option>ตรวจสุขภาพ</option>
                                <option>ขอใบรับรองออนไลน์</option>
                            </select>
                        </label>
                        <div class="flex mt-5 gap-3">
                            <div class="flex">
                                <!-- <p class="text-2xl font-bold">จำนวนการใช้บริการคลินิคตอนนี้ 3 คน</p> -->
                                <div class="mt-[7px] mx-2">
                                    <User />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- หน้าเลือกวันที่และเวลา  -->
            <div v-else-if="currentStep === 2" class="flex flex-col items-center justify-center w-full">
                <div class="grid grid-cols-2 gap-2 w-full p-4" style="grid-template-columns: 1.5fr 2fr;">
                    <div class="bg-opacity-5 bg-teal-800 rounded-md shadow-lg">
                        <!-- Display user-entered data from the first step -->
                        <div class="p-4">
                            <div class="flex justify-between mt-2">
                                <p>ชื่อ</p>
                                <p>{{ useFormData.firstname }}</p>
                            </div>
                            <div class="flex justify-between mt-2">
                                <p>นามสกุล</p>
                                <p>{{ useFormData.lastname }}</p>
                            </div>
                            <div class="flex justify-between mt-2">
                                <p>เลขประจำตัวประชาชน</p>
                                <p>{{ useFormData.cdnumber }}</p>
                            </div>
                            <div class="flex justify-between mt-2">
                                <p>หมวดหมู่</p>
                                <p>{{ useFormData.category }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center shadow-lg rounded-md">
                        <div>
                            <p class="text-2xl font-bold">เลือกวันที่และเวลา</p>
                        </div>
                        <div class="mb-5">
                            <input type="date" class="input input-bordered mt-5 w-full max-w-xs"
                                v-model="useFormData.date" />
                            <input type="time" class="input input-bordered mt-3 w-full max-w-xs"
                                v-model="useFormData.time" />
                        </div>
                        <label class="form-control">
                            <div class="flex justify-center">
                                <span class="text-2xl font-bold">ข้อเสนอแนะ</span>
                            </div>
                            <textarea v-model="useFormData.note" class="textarea textarea-bordered h-24 w-64 mt-2 mb-5"
                                placeholder="ข้อเสนอแนะ"></textarea>
                        </label>
                    </div>
                </div>
            </div>


            <div v-else-if="currentStep === 3" class="flex flex-col items-center justify-center w-full">
                <h1 class="text-3xl font-bold mt-3">รายละเอียดการจอง</h1>
                <div class="bg-opacity-5 bg-teal-800 rounded-md shadow-lg mt-3">
                    <!-- Display user-entered data from the first step -->
                    <div class="p-4 w-[450px]">
                        <div class="flex justify-between mt-2">
                            <p>ชื่อ</p>
                            <p>{{ useFormData.firstname }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>นามสกุล</p>
                            <p>{{ useFormData.lastname }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>เลขประจำตัวประชาชน</p>
                            <p>{{ useFormData.cdnumber }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>หมวดหมู่</p>
                            <p>{{ useFormData.category }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>วันที่</p>
                            <p>{{ useFormData.date }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>เวลา</p>
                            <p>{{ useFormData.time }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>ข้อเสนอแนะ</p>
                            <p>{{ useFormData.note }}</p>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Navigation buttons -->
            <!-- Navigation buttons -->
            <div class="flex justify-end items-end w-full p-4 space-x-2">
                <button v-if="currentStep > 1" @click="prevStep"
                    class="btn btn-accent rounded w-1/4 md:w-1/6 text-white">กลับ</button>
                <button v-if="currentStep === 1" @click="nextStepCurrentstep"
                    class="btn btn-accent rounded w-1/4 md:w-1/6 text-white">ถัดไป</button>
                <button v-else-if="currentStep === 3" @click="confirmReservation"
                    class="btn btn-accent rounded w-1/4 md:w-1/6 text-white">ยืนยันการจอง</button>
                <button v-else @click="nextStepCurrentstep"
                    class="btn btn-accent rounded w-1/4 md:w-1/6 text-white">ถัดไป</button>
            </div>


        </div>

    </UserLayout>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for routing
import UserLayout from '~/layouts/userLayouts.vue';
import { useUserReservatioStore } from '~/stores/reservatio';
import { useAuthStore } from '~/stores/auth'
import { ref, reactive } from 'vue';
import axios from 'axios';

const authStore = useAuthStore()

const currentStep = ref(1);
const userReservation = useUserReservatioStore();
const router = useRouter(); // Initialize router
const steps = ["หมวดหมู่", "เลือกวันที่และเวลา", "ยืนยันการจอง"];
const addresses = ref([])

const formData = reactive([
    {
        name: 'ชื่อ',
        field: 'firstname'
    },
    {
        name: 'นามสกุล',
        field: 'lastname'
    },
    {
        name: 'เลขประจำตัวประชาชน',
        field: 'cdnumber'
    },
]);

const useFormData = reactive({
    userId: authStore.user.id,
    email: authStore.user.email,
    firstname: '',
    lastname: '',
    cdnumber: '',
    note: '',
    category: '',
    date: '',
    time: ''
});

const fetchAddresses = async () => {
    try {
        const response = await axios.get(`/api/users/address?userId=${authStore.user.id}`);
        if (response.data.success) {
            addresses.value = response.data.addresses;
        } else {
            alert('Failed to fetch addresses');
        }
    } catch (error) {
        alert('An error occurred while fetching addresses');
    }
};

// Validation function for required fields in step 1
const validateStepOne = () => {
    return useFormData.firstname && useFormData.lastname && useFormData.cdnumber;
};

const nextStepCurrentstep = () => {
    if (currentStep.value === 1) {
        if (validateStepOne()) {
            currentStep.value++;
            userReservation.confirm(useFormData);
        } else {
            alert("กรุณากรอกข้อมูลที่จำเป็นทั้งหมดในหมวดหมู่");
        }
    } else if (currentStep.value === 2) {
        currentStep.value++;
        userReservation.confirm(useFormData); // Confirming data for step 2
    } else {
        nextStep(); // For steps other than step 1
    }
}

const nextStep = () => {
    if (currentStep.value < steps.length) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const confirmReservation = async () => {
    try {
        // Send reservation data to the backend
        const response = await axios.post('/api/reservations', {
            userId: useFormData.userId,
            firstname: useFormData.firstname,
            lastname: useFormData.lastname,
            cdnumber: useFormData.cdnumber,
            category: useFormData.category,
            date: useFormData.date,
            time: useFormData.time,
            note: useFormData.note,
            email: useFormData.email
        });

        if (response.data.success) {
            alert('Reservation successful!');
            router.push('/user');
        } else {
            alert('Failed to confirm reservation: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error confirming reservation:', error);
        alert('An error occurred while confirming your reservation.');
    }
};


authStore.initializeAuth();

onMounted(async () => {
    await fetchAddresses()
})

// Clear localStorage when leaving the route
onBeforeUnmount(() => {
    localStorage.removeItem('reservation-data');
});

</script>

<style scope>
.text-stroke {
    text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}

.font-kanit {
    font-family: 'Kanit', sans-serif;
}
</style>
