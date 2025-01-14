import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', () => {
  const users = ref<any[]>([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/user')
      users.value = response.data
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const addUser = async (user: any) => {
    const { isConfirmed } = await Swal.fire({
      title: 'ยืนยันการเพิ่มผู้ใช้',
      text: 'คุณต้องการเพิ่มผู้ใช้นี้หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.post('/api/user', user)

      await fetchUsers()
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มผู้ใช้สำเร็จ',
        text: 'ผู้ใช้ของคุณได้ถูกเพิ่มแล้ว',
      })
    } catch (error) {
      console.error('Error adding user:', error)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่',
      })
    }
  }

  const updateUser = async (user: any) => {
    const { isConfirmed } = await Swal.fire({
      title: 'ยืนยันการอัปเดตข้อมูลผู้ใช้',
      text: 'คุณต้องการอัปเดตข้อมูลผู้ใช้นี้หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    });

    if (!isConfirmed) {
      return;
    }

    try {

      await axios.put('/api/user', user);

      await fetchUsers();

      Swal.fire({
        icon: 'success',
        title: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        text: 'ข้อมูลของผู้ใช้ถูกอัปเดตแล้ว',
      });
    } catch (error) {
      console.error('Error updating user:', error);

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้ กรุณาลองใหม่',
      });
    }
  };

  const deleteUser = async (id: number) => {
    
    const { isConfirmed } = await Swal.fire({
      title: 'ยืนยันการลบผู้ใช้',
      text: 'คุณต้องการลบผู้ใช้รายนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete('/api/user', { data: { id } });
      await fetchUsers();

      Swal.fire({
        icon: 'success',
        title: 'ลบผู้ใช้สำเร็จ',
        text: 'ผู้ใช้รายนี้ถูกลบออกจากระบบแล้ว',
      });
    } catch (error) {
      console.error('Error deleting user:', error);

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่',
      });
    }
  };

  return { users, fetchUsers, addUser, updateUser, deleteUser }
})
