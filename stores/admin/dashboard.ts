import { defineStore } from 'pinia';

export const useAdminDashboardStore = defineStore('admin-dashboard', {
    state: () => ({
        list: [],
        ToggleOpenClose: JSON.parse(localStorage.getItem('ToggleOpenClose')) || false,
    }),
    actions: {
        openStore() {
            this.ToggleOpenClose = true;
            localStorage.setItem('ToggleOpenClose', JSON.stringify(this.ToggleOpenClose));
        },
        closeStore() {
            this.ToggleOpenClose = false;
            localStorage.setItem('ToggleOpenClose', JSON.stringify(this.ToggleOpenClose));
        }
    }
});