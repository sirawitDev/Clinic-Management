
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePatientHistoryStore = defineStore('patientHistory', {
  state: () => ({}),
  actions: {
    async submitPatientHistory(patientHistoryData: {
      patientId: number;
      weight: number;
      height: number;
      temperature: number;
      bloodPressure: number;
      pulse: number;
      respiration: number;
      chiefComplaint: string;
      symptoms: string;
      physicalExam: string;
    }) {
      try {
        const response = await axios.post('/api/patientHistory', patientHistoryData);
        return response.data;
      } catch (error) {
        console.error('An error occurred:', error);
        throw error; // รี-throw เพื่อให้สามารถจัดการกับข้อผิดพลาดได้จากที่เรียกใช้งาน
      }
    }
  }
});