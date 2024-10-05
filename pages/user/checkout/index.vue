<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import UserLayout from '~/layouts/userLayouts.vue';

import { useUserCartStore } from '~/stores/users/cart';

const userCartStore = useUserCartStore();
const router = useRouter()

const formData = [
    {
        name: 'Email address',
        field: 'email'
    },
    {
        name: 'Name',
        field: 'name'
    },
    {
        name: 'Address',
        field: 'address'
    },
    {
        name: 'Note',
        field: 'note'
    }
];

const useFormData = reactive({
    email: '',
    name: '',
    address: '',
    note: ''
});

const payment = () => {
    try {
        userCartStore.checkout(useFormData)
        router.push({ name: 'success' })
    } catch (error) {
        console.log('error', error)
    }
};

// function Time
const maxLength = 100;

const expandedStates = ref(userCartStore.items.map(() => false));

const isExpanded = (index) => expandedStates.value[index];
const toggleReadMore = (index) => {
    expandedStates.value[index] = !expandedStates.value[index];
};
const isTruncated = (item) => item.about.length > maxLength;
const truncatedText = (item) => item.about.substring(0, maxLength);

</script>

<template>
    <UserLayout>
        <div class="flex justify-center items-center">
            <div
                class="flex bg-zinc-200 w-52 rounded-full h-20 justify-center items-center border border-gray-200 shadow-sm dark:border-base-700">
                <h1 class="text-4xl font-bold">Checkout</h1>
            </div>
        </div>
        <div class="flex my-5">

            <section class="flex-auto w-64 bg-base-200 p-8 mr-4 rounded-lg h-full">
                <div v-for="form in formData" :key="form.field" class="form-control w-full">
                    <div class="label">
                        <span class="label-text">{{ form.name }}</span>
                    </div>
                    <textarea v-if="form.field === 'address'" class="textarea textarea-bordered h-24"
                        placeholder="Address" v-model="useFormData[form.field]"></textarea>
                    <input v-else type="text" placeholder="Type here" class="input input-bordered input-sm w-full"
                        v-model="useFormData[form.field]" />
                </div>
                <button @click="payment" class="btn btn-neutral w-full mt-4">ชำระเงิน</button>
            </section>

            <section class="flex flex-col flex-auto w-32 bg-zinc-200 rounded-lg items-center">
                <div v-for="(item, index) in userCartStore.items" :key="index"
                    class="flex w-[90%] h-[40%] rounded-lg mt-5  border border-gray-200 bg-zinc-50 p-2 shadow-sm dark:border-base-700">
                    <div class="flex flex-[1] items-center mx-5">
                        <img :src="item.imageUrl" class="rounded-3xl p-2 w-full h-[60%]">
                    </div>
                    <div class="flex flex-[3]">
                        <div class="flex flex-col text-lg font-bold mt-2 justify-between">
                            <div class="mx-5 mt-2">
                                {{ item.name }}
                                <p class="font-light text-sm">
                                    {{ isExpanded(index) ? item.about : truncatedText(item) }}
                                    <span v-if="!isExpanded(index) && isTruncated(item)">...</span>
                                    <button v-if="isTruncated(item)" @click="toggleReadMore(index)"
                                        class="text-blue-500 underline ml-2">
                                        {{ isExpanded(index) ? 'Read Less' : 'Read More' }}
                                    </button>
                                </p>
                            </div>
                            <div class="flex justify-between">
                                <div class="mx-5 mt-2">
                                    <p class="mt-3">จำนวน : {{ item.quantity }}</p>
                                </div>
                                <div class="mx-5 mt-2">
                                    <p class="mt-3">ราคา : {{ item.price }} ฿</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider pr-10 pl-10"></div>

                <div class="flex flex-col w-[90%] bg-zinc-50 rounded-lg h-[50%] justify-center shadow-sm">
                    <div class="flex justify-center">
                        <div class="text-2xl font-bold">Order Summary</div>
                    </div>
                    <div class="flex justify-between w-full mt-5">
                        <div class="mx-10">ราคาสินค้าทั้งหมด</div>
                        <div class="mx-10">{{ userCartStore.summaryPrice }} ฿</div>
                    </div>
                    <div class="flex justify-between w-full mt-2">
                        <div class="mx-10">ค่าส่ง</div>
                        <div class="mx-10">0 ฿</div>
                    </div>
                </div>
                <div class="divider pr-10 pl-10"></div>
                <div class="flex justify-between mb-5 bg-zinc-50 w-[90%] rounded-lg shadow-sm">
                    <div class="mx-10 font-bold text-xl my-2">ราคาทั้งหมด</div>
                    <div class="mx-10 font-bold text-xl my-2">{{ userCartStore.summaryPrice }} ฿</div>
                </div>
            </section>
        </div>

    </UserLayout>
</template>

<style scoped>
.flex-1 {
    flex: 1 1 60%;
}

.flex-2 {
    flex: 1 1 40%;
}

.relative {
    position: relative;
}

.absolute {
    position: absolute;
}
</style>