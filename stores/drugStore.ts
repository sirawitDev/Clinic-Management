// src/stores/drugStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDrugStore = defineStore('drug', () => {
  const drugs = ref<any[]>([]) // เปลี่ยนชื่อ store เป็น 'drug' และอ้างอิงข้อมูลยา

  // ฟังก์ชันดึงข้อมูลยา
  const fetchDrugs = async () => {
    try {
      const response = await fetch('/api/drugs') // ใช้ fetch แทน axios
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      drugs.value = data
    } catch (error) {
      console.error('Error fetching drugs:', error)
    }
  }

  // ฟังก์ชันเพิ่มข้อมูลยา
  const addDrug = async (drug: any) => {
    try {
      const response = await fetch('/api/drugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(drug)
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      await fetchDrugs()
    } catch (error) {
      console.error('Error adding drug:', error)
    }
  }

  // ฟังก์ชันอัปเดตข้อมูลยา
  const updateDrug = async (drug: any) => {
    try {
      const response = await fetch('/api/drugs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(drug)
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      await fetchDrugs()
    } catch (error) {
      console.error('Error updating drug:', error)
    }
  }

  // ฟังก์ชันลบข้อมูลยา
  const deleteDrug = async (id: number) => {
    try {
      const response = await fetch('/api/drugs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      await fetchDrugs()
    } catch (error) {
      console.error('Error deleting drug:', error)
    }
  }

  return { drugs, fetchDrugs, addDrug, updateDrug, deleteDrug }
})
