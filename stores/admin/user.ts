import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      this.users = await response.json();
    },
    async deleteUser(userEmail) {
      const response = await fetch(`/api/admin/users.delete?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to delete user');
      }
      await this.fetchUsers(); // Refresh user list after deletion
    },
  },
});
