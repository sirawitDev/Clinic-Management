<template>
  <AdminLayout>
    <div class=" mx-auto p-4 bg-zinc-50 rounded-lg h-full">
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-5">

        <div class="bg-white p-4 rounded-md">
          <div
            class="flex justify-center items-center bg-orange-400 bg-opacity-80 rounded-full shadow-sm sm:w-80 w-72 h-16 mt-5 mx-auto">
            <h1 class="font-bold text-white text-center sm:text-3xl text-2xl text-stroke">ข้อมูลการใช้ยา</h1>
          </div>
          <button class="btn font-light btn-accent text-white mt-3 w-full"
            onclick="my_modal_9.showModal()">เพิ่มระยะการใช้ยา</button>
          <dialog id="my_modal_9" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div class="flex justify-center">
                <h3 class="text-2xl font-bold">เพิ่มข้อมูลระยะการใช้ยา</h3>
              </div>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text"></span>
                </div>
                <input type="text" v-model="newPeriodTitle" placeholder="เพิ่มข้อมูลระยะการใช้ยา"
                  class="input input-bordered w-full" />
              </label>

              <div class="btn btn-accent font-light text-white w-full mt-3" @click="addPeriod">
                <p>เพิ่มข้อมูล</p>
              </div>
            </div>
          </dialog>
          <!-- Display Loading message if data is still loading -->
          <div v-if="isLoading" class="flex justify-center items-center h-32">
            <span class="loading loading-spinner text-accent"></span>
          </div>
          <!-- Display table once data is fetched -->
          <table class="table mt-3">
            <thead>
              <tr>
                <th>
                  <p class="text-center">ID</p>
                </th>
                <th>
                  <p class="text-center"></p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in periods" :key="item.id">
                <th>
                  <p class="text-center">{{ index + 1 }}</p>
                </th>
                <td>
                  <p class="text-center">{{ item.title }}</p>
                </td>
                <td>
                  <div class="flex gap-2 justify-center">
                    <button class="btn bg-red-500 hover:bg-red-300" @click="deletePeriod(item.id)">
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2 -->
        <div class="bg-white p-4 rounded-md">
          <div
            class="flex justify-center items-center bg-orange-400 bg-opacity-80 rounded-full shadow-sm sm:w-80 w-72 h-16 mt-5 mx-auto">
            <h1 class="font-bold text-white text-center sm:text-3xl text-2xl text-stroke">ข้อมูลการวินิฉัย</h1>
            <!-- diagnosis-->
          </div>
          <button class="btn font-light btn-accent text-white mt-3 w-full"
            onclick="my_modal_10.showModal()">เพิ่มข้อมูลการวินิฉัย</button>
          <dialog id="my_modal_10" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div class="flex justify-center">
                <h3 class="text-2xl font-bold">เพิ่มข้อมูลการวินิฉัย</h3>
              </div>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text"></span>
                </div>
                <input type="text" v-model="newInfoDiagnosis" placeholder="เพิ่มข้อมูลการวินิฉัย"
                  class="input input-bordered w-full" />
              </label>

              <div class="btn btn-accent font-light text-white w-full mt-3" @click="addinfoDiagnosis">
                <p>เพิ่มข้อมูล</p>
              </div>
            </div>
          </dialog>
          <!-- Display Loading message if data is still loading -->
          <div v-if="isLoading" class="flex justify-center items-center h-32">
            <span class="loading loading-spinner text-accent"></span>
          </div>
          <!-- Display table once data is fetched -->
          <table class="table mt-3">
            <thead>
              <tr>
                <th>
                  <p class="text-center">ID</p>
                </th>
                <th>
                  <p class="text-center"></p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in infodiagnosises" :key="item.id">
                <th>
                  <p class="text-center">{{ index + 1 }}</p>
                </th>
                <td>
                  <p class="text-center">{{ item.title }}</p>
                </td>
                <td>
                  <div class="flex gap-2 justify-center">
                    <button class="btn bg-red-500 hover:bg-red-300" @click="deleteDiagnosis(item.id)">
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="divider"></div>

      <div class="mt-3 rounded-md h-24 grid sm:grid-cols-2 grid-cols-1 ">
        <!-- 1 ข้อมูลแผนการรักษา -->
        <div class="bg-white p-4 rounded-md">
          <div
            class="flex justify-center items-center bg-orange-400 bg-opacity-80 rounded-full shadow-sm sm:w-80 w-72 h-16 mt-5 mx-auto">
            <h1 class="font-bold text-white text-center sm:text-3xl text-2xl text-stroke">ข้อมูลแผนการรักษา</h1>
            <!-- treatment_plan-->
          </div>
          <button class="btn font-light btn-accent text-white mt-3 w-full"
            onclick="my_modal_11.showModal()">เพิ่มข้อมูลแผนการรักษา</button>
          <dialog id="my_modal_11" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div class="flex justify-center">
                <h3 class="text-2xl font-bold">เพิ่มข้อมูลแผนการรักษา</h3>
              </div>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text"></span>
                </div>
                <input type="text" v-model="newInfoTreatment" placeholder="เพิ่มข้อมูลแผนการรักษา"
                  class="input input-bordered w-full" />
              </label>

              <div class="btn btn-accent font-light text-white w-full mt-3" @click="addinfoTreatment">
                <p>เพิ่มข้อมูล</p>
              </div>
            </div>
          </dialog>

          <!-- Display Loading message if data is still loading -->
          <div v-if="isLoading" class="flex justify-center items-center h-32">
            <span class="loading loading-spinner text-accent"></span>
          </div>
          <!-- Display table once data is fetched -->
          <table class="table mt-3">
            <thead>
              <tr>
                <th>
                  <p class="text-center">ID</p>
                </th>
                <th>
                  <p class="text-center"></p>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in infotreatments" :key="item.id">
                <th>
                  <p class="text-center">{{ index + 1 }}</p>
                </th>
                <td>
                  <p class="text-center">{{ item.title }}</p>
                </td>
                <td>
                  <div class="flex gap-2 justify-center">
                    <button class="btn bg-red-500 hover:bg-red-300" @click="deleteTreatment(item.id)">
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>



      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '~/layouts/adminLayout2.vue'
import Trash from '~/components/admin/Trash.vue'
import Edit from '~/components/admin/Edit.vue'
import Swal from 'sweetalert2';

const isLoading = ref(true);
const newPeriodTitle = ref('');
const newInfoDiagnosis = ref('')
const newInfoTreatment = ref('')

const periods = ref([]);
const infodiagnosises = ref([])
const infotreatments = ref([])

//infoDiagnosis Function
const fetchinfoDiagnosis = async () => {
  try {
    const response = await fetch('/api/infodiagnosis', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    infodiagnosises.value = await response.json();
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

const addinfoDiagnosis = async () => {
  document.getElementById('my_modal_10').close();
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการเพิ่มข้อมูลการวินิจฉัยนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, เพิ่มเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/infodiagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newInfoDiagnosis.value }),
      });

      if (!response.ok) {
        throw new Error('Error adding diagnosis information');
      }

      newInfoDiagnosis.value = '';
      document.getElementById('my_modal_10')?.close();


      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มข้อมูลสำเร็จ!',
        text: 'ข้อมูลการวินิจฉัยได้รับการเพิ่มเรียบร้อยแล้ว',
      });

      await fetchinfoDiagnosis();
    } catch (error) {
      console.error('Error adding diagnosis information:', error);

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเพิ่มข้อมูลการวินิจฉัยได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

const deleteDiagnosis = async (id) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบการวินิจฉัยนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/infodiagnosis?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting diagnosis');
      }

      await Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ!',
        text: 'การวินิจฉัยถูกลบเรียบร้อยแล้ว',
      });

      await fetchinfoDiagnosis();
    } catch (error) {
      console.error('Error deleting diagnosis:', error);

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบการวินิจฉัยได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

const fetchPeriods = async () => {
  try {
    const response = await fetch('/api/periodOfdrug', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    periods.value = await response.json();
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

const addPeriod = async () => {
  document.getElementById('my_modal_9').close();
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการเพิ่ม ข้อมูลการใช้ยา นี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, เพิ่มเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/periodOfdrug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newPeriodTitle.value }),
      });

      if (!response.ok) {
        throw new Error('Error adding period');
      }
      newPeriodTitle.value = '';
      document.getElementById('my_modal_9')?.close();

      await fetchPeriods();

      await Swal.fire({
        icon: 'success',
        title: 'เพิ่ม ข้อมูลการใช้ยา สำเร็จ',
        text: 'ข้อมูลการใช้ยา ถูกเพิ่มเรียบร้อยแล้ว',
      });
    } catch (error) {
      console.error('Error adding period:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเพิ่ม ข้อมูลการใช้ยา ได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

const deletePeriod = async (id) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบข้อมูลการใช้ยานี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/periodOfdrug?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting period');
      }
      await response.json();
      await fetchPeriods();

      await Swal.fire({
        icon: 'success',
        title: 'ลบ ข้อมูลการใช้ยา สำเร็จ',
        text: 'ข้อมูลการใช้ยาได้ถูกลบเรียบร้อยแล้ว',
      });
    } catch (error) {
      console.error('Error deleting period:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลการใช้ยาได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

//treatment_plan function
const fetchinfoTreatment = async () => {
  try {
    const response = await fetch('/api/infotreatment', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    infotreatments.value = await response.json();
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching periodOfdrug:', error);
  }
};

const addinfoTreatment = async () => {
  document.getElementById('my_modal_11').close();
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการเพิ่มข้อมูลการรักษานี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, เพิ่มเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/infotreatment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newInfoTreatment.value }),
      });

      if (!response.ok) {
        throw new Error('Error adding treatment information');
      }
      newInfoTreatment.value = '';
      document.getElementById('my_modal_11')?.close();

      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มข้อมูลสำเร็จ!',
        text: 'ข้อมูลการรักษาได้รับการเพิ่มเรียบร้อยแล้ว',
      });

      await fetchinfoTreatment();
    } catch (error) {
      console.error('Error adding treatment information:', error);

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเพิ่มข้อมูลการรักษาได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

const deleteTreatment = async (id) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบแผนการรักษานี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/infotreatment?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting treatment');
      }

      await Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ!',
        text: 'แผนการรักษาถูกลบเรียบร้อยแล้ว',
      });

      await fetchinfoTreatment();
    } catch (error) {
      console.error('Error deleting treatment:', error);

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบแผนการรักษาได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
};

onMounted(async () => {
  await fetchPeriods()
  await fetchinfoDiagnosis()
  await fetchinfoTreatment()
})

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
.text-stroke {
  text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>