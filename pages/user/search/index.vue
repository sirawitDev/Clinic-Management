<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserLayout from '~/layouts/userLayouts.vue';
import Product from "~/components/user/Product.vue";

import { useUserProductStore } from "~/stores/users/product";

const userProductStore = useUserProductStore()

const route = useRoute();
const router = useRouter();
const searchText = ref('');



onMounted(async () => {
    await userProductStore.loadProducts();
    if (route.query.q) {
        searchText.value = route.query.q;
    }
});

watch(() => route.query.q, (newSearchText) => {
    searchText.value = newSearchText;
}, { immediate: true });

const filterProducts = computed(() => {
    return userProductStore.filterProducts(searchText.value);
});
</script>

<template>
    <UserLayout>
        <div class="text-3xl m-4">Search: <b>{{ searchText }}</b></div>
        <Product :products="filterProducts" />
    </UserLayout>
</template>
