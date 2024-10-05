import { defineStore } from 'pinia';

export const useUserProductStore = defineStore('product', {
    state: () => ({
        list: [],
    }),
    actions: {
        async loadProducts() {
            try {
                const response = await fetch('/api/product', {
                    method: 'GET',
                });
                const data = await response.json();
                this.list = data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        filterProducts(searchText) {
            return this.list.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    }
});
