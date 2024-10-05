import { defineStore } from 'pinia';
import { useFetch } from '#app'; // Nuxt's useFetch for making API calls

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    payment: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPayments() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch('/api/payment', {
          method: 'GET',
        });
        if (error.value) throw error.value;
        this.payments = data.value;
      } catch (err) {
        this.error = err.message || 'Error fetching payments';
      } finally {
        this.loading = false;
      }
    },

    async fetchPaymentById(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch(`/api/payment?id=${id}`, {
          method: 'GET',
        });
        if (error.value) throw error.value;
        this.payment = data.value;
      } catch (err) {
        this.error = err.message || 'Error fetching payment';
      } finally {
        this.loading = false;
      }
    },

    async createPayment(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch('/api/payment', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (error.value) throw error.value;
        this.payments.push(data.value); // Update the state with new payment
      } catch (err) {
        this.error = err.message || 'Error creating payment';
      } finally {
        this.loading = false;
      }
    },

    async updatePayment(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await useFetch(`/api/payment?id=${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (error.value) throw error.value;
        const index = this.payments.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.payments[index] = data.value;
        }
      } catch (err) {
        this.error = err.message || 'Error updating payment';
      } finally {
        this.loading = false;
      }
    },

    async deletePayment(id) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await useFetch(`/api/payment?id=${id}`, {
          method: 'DELETE',
        });
        if (error.value) throw error.value;
        this.payments = this.payments.filter((payment) => payment.id !== id);
      } catch (err) {
        this.error = err.message || 'Error deleting payment';
      } finally {
        this.loading = false;
      }
    },
  },
});
