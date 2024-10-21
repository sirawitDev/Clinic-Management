<script setup>
import cashierLayouts from '~/layouts/cashierLayouts.vue';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore()


import Search from '~/components/cashier/Search.vue';

const drugs = ref([]);
const diagnosesFetch = ref([]);
const patientsFetch = ref([]);
const physicianFetch = ref([]);
const selectedDrugs = ref(JSON.parse(localStorage.getItem('selectedDrugs')) || []);
const activeTab = ref('สินค้าทั้งหมด');
const selectedDrug = ref(null);
const selectedDiagnosis = ref(null);
const searchQuery = ref('');

const pendingDiagnoses = computed(() => {
  return diagnosesFetch.value.filter(diagnosis => diagnosis.paymentStatus === 'pening');
});

const filteredDrugs = computed(() => {
  // Step 2: Filter drugs based on the search query
  return drugs.value.filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchPatients = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    patientsFetch.value = await response.json();
    console.log('Fetched patients:', patientsFetch.value);
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

const fetchPhysicians = async () => {
  try {
    const response = await fetch('/api/physician', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch physicians');
    }

    physicianFetch.value = await response.json();
    console.log('Fetched physicians:', physicianFetch.value);
  } catch (error) {
    console.error('Error fetching physicians:', error);
  }
};

const fetchDiagnoses = async () => {
  try {
    const response = await fetch('/api/diagnosis', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch diagnoses');
    }

    diagnosesFetch.value = await response.json();
    console.log('Fetched diagnoses:', diagnosesFetch.value);
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
  }
};

const fetchDrugs = async () => {
  try {
    const response = await fetch('/api/drug');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    drugs.value = await response.json();
  } catch (error) {
    console.error('Error fetching drugs:', error);
  }
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const updateLocalStorage = () => {
  localStorage.setItem('selectedDrugs', JSON.stringify(selectedDrugs.value));
};

const addDrug = (drug) => {
  const existingDrug = selectedDrugs.value.find(d => d.id === drug.id);
  if (existingDrug) {
    existingDrug.quantity++;
  } else {
    selectedDrugs.value.push({ ...drug, quantity: 1 });
  }
  updateLocalStorage();
};

const removeDrug = (drug) => {
  const existingDrug = selectedDrugs.value.find(d => d.id === drug.id);
  if (existingDrug && existingDrug.quantity > 1) {
    existingDrug.quantity--;
  } else {
    selectedDrugs.value = selectedDrugs.value.filter(d => d.id !== drug.id);
  }
  updateLocalStorage();
};

const totalPrice = computed(() => {
  return selectedDrugs.value.reduce((total, drug) => total + (drug.price * drug.quantity), 0);
});

const getPatientName = (id) => {
  const patient = patientsFetch.value.find(patient => patient.id === id);
  return patient ? `${patient.firstname} ${patient.lastname}` : 'Unknown Patient';
};

const completePayment = async () => {
  try {
    const diagnosisId = pendingDiagnoses.value.length > 0 ? pendingDiagnoses.value[0].id : null;
    const storedSelectedDrugs = JSON.parse(localStorage.getItem('selectedDrugs')) || [];

    const orderNumber = storedSelectedDrugs.map(drug => drug.id).join(','); // Join IDs with commas
    const totalAmount = storedSelectedDrugs.reduce((total, drug) => total + (drug.price * drug.quantity), 0);

    // Prepare the payment data
    const paymentData = {
      orderNumber,
      totalAmount,
      diagnosisId: diagnosisId, // Include the selected diagnosis ID
    };

    console.log('Payment Data:', paymentData); // Log payment data for debugging

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to complete payment');
    }

    const result = await response.json();
    console.log('Payment completed:', result);
    selectedDrugs.value = [];
    localStorage.removeItem('selectedDrugs');
    await updateSuccess()
    alert('ชำระเงินเสร็จสิ้น')
    router.push('/cashier/list')
  } catch (error) {
    console.error('Error completing payment:', error);
  }
};

const updateSuccess = async () => {
  try {
    const diagnosisIds = pendingDiagnoses.value.map(diagnosis => diagnosis.id);

    const response = await fetch('/api/cashierSuccess', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        diagnosisId: diagnosisIds,
        paymentStatus: 'success',
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('Updated successfully');
    } else {
      console.log('Failed to update');
    }
  } catch (error) {
    console.error('Error updating CD number:', error);
    console.error('An error occurred while updating');
  }
};


onMounted(async () => {
  await fetchDrugs()
  await fetchDiagnoses()
  await fetchPatients()
  await fetchPhysicians()
  console.log(selectedDiagnosis.value)
  console.log('pee : ' ,pendingDiagnoses.value)
});

watch(selectedDiagnosis, (newVal) => {
  console.log('Selected Diagnosis changed:', newVal);
  pendingDiagnoses.value.forEach(item => {
    console.log('id: ', item.id);
});
});
</script>




<template>
  <cashierLayouts>
    <div class="flex h-screen">

      <div class="flex-64 flex-col w-[70%] hidden sm:block">
        <div class="flex gap-10">
          <div class=" bg-white mt-5 rounded-lg w-[70%] shadow-md h-28">
            <div class="form-control w-[80%] mx-auto">
              <div class="label">
                <span class="label-text">เลือกการตรวจเพื่อจ่ายยา</span>
              </div>
              <select class="select select-bordered text-black" v-model="selectedDiagnosis">
                <option disabled value="">
                  <p class="text-black">เลือกหนึ่งรายการ</p>
                </option>
                <option v-for="diagnosis in pendingDiagnoses">
                  <span class="text-blue-500">{{ getPatientName(diagnosis.patient_id) }}</span>
                  &nbsp;
                  <span class="font-bold">{{ diagnosis.treatment_plan }}</span>
                </option>
              </select>
            </div>
          </div>
          <div class="w-[60%] mt-10">
            <div class="form-control">
              <div class="flex gap-5 mr-4 mt-5">
                <Search></Search>
                <input type="text" placeholder="ค้นหาชื่อยา" class="input input-bordered w-full"
                  v-model="searchQuery" />
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- ปุ่มที่สามารถคลิกเพื่อเปลี่ยนแท็บ -->
        <div class="flex gap-10">
          <button class="btn btn-ghost rounded-full w-52" :class="{ 'btn-active': activeTab === 'สินค้าทั้งหมด' }"
            @click="setActiveTab('สินค้าทั้งหมด')">
            <p class="font-light">สินค้าทั้งหมด</p>
          </button>
          <!-- <button class="btn btn-ghost rounded-full" :class="{ 'btn-active': activeTab === 'ยาใช้ภายนอก' }"
            @click="setActiveTab('ยาใช้ภายนอก')">
            <p class="font-light">ยาใช้ภายนอก</p>
          </button>
          <button class="btn btn-ghost rounded-full" :class="{ 'btn-active': activeTab === 'ยาใช้ภายใน' }"
            @click="setActiveTab('ยาใช้ภายใน')">
            <p class="font-light">ยาใช้ภายใน</p>
          </button>
          <button class="btn btn-ghost rounded-full" :class="{ 'btn-active': activeTab === 'อาหารเสริม' }"
            @click="setActiveTab('อาหารเสริม')">
            <p class="font-light">อาหารเสริม</p>
          </button>
          <button class="btn btn-ghost rounded-full" :class="{ 'btn-active': activeTab === 'ยาเฉพาะทาง' }"
            @click="setActiveTab('ยาเฉพาะทาง')">
            <p class="font-light">ยาเฉพาะทาง</p>
          </button> -->
        </div>

        <!-- เนื้อหาที่จะแสดงตามปุ่มที่ถูกกด -->
        <div v-if="activeTab === 'สินค้าทั้งหมด'">
          <div class="grid grid-cols-4 gap-1">
            <button v-for="drug in filteredDrugs" :key="drug.id"
              class="w-48 h-52 p-4 mt-5 rounded-2xl border-2 flex flex-col items-center justify-between"
              @click="addDrug(drug)">
              <div class="flex flex-col items-center">
                <img :src="drug.imageUrl" alt="Drug Image" class="w-24 h-24 object-cover" />
                <p class="text-sm font-light text-[#2A3E57] mt-2 text-center">{{ drug.name }}</p>
              </div>
              <div class="flex justify-center">
                <p class="text-base font-light text-accent mt-2 text-center">ราคา {{ drug.price }} ฿</p>
              </div>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'ยาใช้ภายนอก'">
          ยาใช้ภายนอก
        </div>
        <div v-if="activeTab === 'ยาใช้ภายใน'">
          ยาใช้ภายใน
        </div>
        <div v-if="activeTab === 'อาหารเสริม'">
          อาหารเสริม
        </div>
        <div v-if="activeTab === 'ยาเฉพาะทาง'">
          ยาเฉพาะทาง
        </div>
      </div>

      <div class="flex-32 flex-col sm:hidden">

        <div class=" bg-white mt-5 rounded-lg w-[90%] shadow-md h-28">
          <div class="form-control w-[80%] mx-auto">
            <div class="label">
              <span class="label-text">เลือกการตรวจเพื่อจ่ายยา</span>
            </div>
            <select class="select select-bordered text-black" v-model="selectedDiagnosis">
              <option disabled value="">
                <p class="text-black">เลือกหนึ่งรายการ</p>
              </option>
              <option v-for="diagnosis in diagnosesFetch" :key="diagnosis.id" :value="diagnosis.id">
                <span class="text-blue-500">{{ getPatientName(diagnosis.patient_id) }}</span>
                &nbsp;
                <span class="font-bold">{{ diagnosis.treatment_plan }}</span>
              </option>
            </select>
          </div>

          <div class=" mt-10">
            <div class="form-control">
              <div class="flex gap-5 mt-5">
                <Search></Search>
                <input type="text" placeholder="ค้นหาชื่อยา" class="input input-bordered w-full"
                  v-model="searchQuery" />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="flex justify-center gap-10 mt-5">
            <button class="btn btn-ghost rounded-full w-52" :class="{ 'btn-active': activeTab === 'สินค้าทั้งหมด' }"
              @click="setActiveTab('สินค้าทั้งหมด')">
              <p class="font-light">สินค้าทั้งหมด</p>
            </button>
          </div>

          <div v-if="activeTab === 'สินค้าทั้งหมด'">
            <div class="grid grid-cols-2 gap-1">
              <button v-for="drug in filteredDrugs" :key="drug.id"
                class=" w-[110px] h-52 p-4 mt-5 rounded-2xl border-2 flex flex-col items-center justify-between"
                @click="addDrug(drug)">
                <div class="flex flex-col items-center">
                  <img :src="drug.imageUrl" alt="Drug Image" class="w-24 h-24 object-cover" />
                  <p class="text-[11px] font-light text-[#2A3E57] mt-2 text-center">{{ drug.name }}</p>
                </div>
                <div class="flex justify-center">
                  <p class="text-sm font-light text-accent mt-2 text-center">ราคา {{ drug.price }} ฿</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
      <!-- เส้นคั่น -->
      <div class="divider divider-horizontal "></div>

      <div class="flex-32 w-[30%] hidden sm:block">

        <div class="flex mt-3 justify-between w-full">
          <div class="mt-2">
            <h1 class="text-2xl">รายการสินค้า</h1>
          </div>
          <div>
            <button class="btn btn-accent text-white font-light"
              @click="selectedDrugs.splice(0, selectedDrugs.length)">เคลียร์สินค้า</button>
          </div>
        </div>

        <!-- drug selected-->
        <div v-for="drug in selectedDrugs" :key="drug.id"
          class=" bg-zinc-50 shadow-md rounded-md h-24 mt-5 p-4 flex justify-between items-center">
          <img :src="drug.imageUrl" alt="Selected Drug Image" class="w-16 h-16 object-cover bg-white" />
          <div>
            <h1 class="text-sm">{{ drug.name }}</h1>
            <p class="text-sm">ราคา: {{ drug.price }} ฿</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-sm" @click="removeDrug(drug)">-</button>
            <p>{{ drug.quantity }}</p>
            <button class="btn btn-sm" @click="addDrug(drug)">+</button>
          </div>
        </div>
        <div class="bg-zinc-50 shadow-md rounded-md h-24 mt-5 p-4">
          <div class="flex justify-between p-5">
            <div>
              <h1 class="text-xl">รวมราคา</h1>
            </div>
            <div>
              <h1 class="text-xl">{{ totalPrice }} ฿</h1>
            </div>

          </div>
          <button class="btn btn-accent w-full mt-5 text-white font-light"
            onclick="my_modal_3.showModal()">ชำระเงิน</button>
          <div class=" absolute bottom-5 w-92">
            <dialog id="my_modal_3" class="modal fixed inset-0 flex items-center justify-center bg-black/50">
              <div class="modal-box relative bg-white p-6 rounded-lg shadow-lg w-full">
                <form method="dialog">
                  <button class="absolute right-5 top-5 text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </form>

                <div class="flex justify-between p-1 mt-5">
                  <h3 class="text-lg font-bold mb-4">ยอดรวมทั้งหมด</h3>
                  <h1 class="text-xl">{{ totalPrice }} ฿</h1>
                </div>

                <div class="flex justify-center">
                  <img src="https://img2.pic.in.th/pic/IMG_1284.jpg" alt="Prompt Pay QR Code" class=" w-72 rounded-lg">
                </div>

                <div>
                  <button @click="completePayment"
                    class="btn btn-accent w-full text-white font-light mt-5">เสร็จสิ้น</button>
                </div>
              </div>
            </dialog>

          </div>
        </div>
      </div>

      <div class="flex-32 sm:hidden">
        <div class="mt-5 w-32">
          <h1 class="text-sm text-center">รายการสินค้า</h1>
        </div>
        <button class="btn btn-accent btn-base w-full text-white font-light mt-2"
          @click="selectedDrugs.splice(0, selectedDrugs.length)">
          เคลียร์สินค้า
        </button>
        <div v-for="drug in selectedDrugs" :key="drug.id"
          class=" bg-zinc-50 shadow-md rounded-md h-32 w-52 mt-5 p-4 flex justify-between items-center">
          <img :src="drug.imageUrl" alt="Selected Drug Image" class="w-16 h-16 object-cover bg-white" />
          <div>
            <h1 class="text-[12px]">{{ drug.name }}</h1>
            <p class="text-sm mt-3">ราคา: {{ drug.price }} ฿</p>
            <div class="flex justify-center gap-2 mt-2">
              <button class="btn btn-sm" @click="removeDrug(drug)">-</button>
              <p>{{ drug.quantity }}</p>
              <button class="btn btn-sm" @click="addDrug(drug)">+</button>
            </div>
          </div>
        </div>
        <div class="bg-zinc-50 shadow-md rounded-md h-20 mt-5 p-4 w-48">
          <div class="flex justify-between p-4">
            <div>
              <h1 class="text-base">รวมราคา</h1>
            </div>
            <div>
              <h1 class="text-base">{{ totalPrice }} ฿</h1>
            </div>

          </div>
          <button class="btn btn-accent w-full mt-5 text-white font-light"
            onclick="my_modal_14.showModal()">ชำระเงิน</button>
          <div class="">
            <dialog id="my_modal_14" class="modal fixed inset-0 flex items-center justify-center bg-black/50">
              <div class="modal-box relative bg-white p-6 rounded-lg shadow-lg w-[80%]">
                <form method="dialog">
                  <button class="absolute right-5 top-5 text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </form>

                <div class="flex justify-between p-1 mt-5">
                  <h3 class="text-lg font-bold mb-4">ยอดรวมทั้งหมด</h3>
                  <h1 class="text-xl">{{ totalPrice }} ฿</h1>
                </div>

                <div class="flex justify-center">
                  <img src="https://img2.pic.in.th/pic/IMG_1284.jpg" alt="Prompt Pay QR Code" class=" w-72 rounded-lg">
                </div>

                <div>
                  <button @click="completePayment"
                    class="btn btn-accent w-full text-white font-light mt-5">เสร็จสิ้น</button>
                </div>
              </div>
            </dialog>

          </div>
        </div>
      </div>
    </div>
  </cashierLayouts>
</template>


<style scoped>
.h-screen {
  height: 100vh;
}

.divider {
  border-left-width: 1px;
  border-color: #e5e7eb;
}

.divider-horizontal {
  border-top-width: 0;
  border-bottom-width: 0;
}

.btn-active {
  background-color: #4caf50;
  color: white;
}
</style>
