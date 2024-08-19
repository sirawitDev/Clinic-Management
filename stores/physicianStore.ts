import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const usePhysicianStore = defineStore('physician', () => {
  const physicians = ref<any[]>([])

  // Action: Fetch Users
  const fetchPhysician = async () => {
    try {
      const response = await axios.get('/api/physician')
      physicians.value = response.data
    } catch (error) {
      console.error('Error fetching physician:', error)
    }
  }

  const addPhysician = async (physician: any) => {
    try {
      await axios.post('/api/physician', physician)
      await fetchPhysician()
    } catch (error) {
      console.error('Error adding physician:', error)
    }
  }

  const updatePhysician = async (physician: any) => {
    try {
      await axios.put('/api/physician', physician)
      await fetchPhysician()
    } catch (error) {
      console.error('Error updating physician:', error)
    }
  }

  const deletePhysician = async (id: number) => {
    try {
      await axios.delete('/api/physician', { data: { id } })
      await fetchPhysician()
    } catch (error) {
      console.error('Error deleting physician:', error)
    }
  }

  return { physicians, fetchPhysician, addPhysician, updatePhysician, deletePhysician }
})