<template>
  <UserLayout>
    <div class="flex rounded-md bg-white mx-auto border border-base-200 shadow-xl p-5">
      <!-- Use the ProfileAside component -->
      <ProfileAside />
      
      <div class="flex-1 p-5">
        <div class="font-bold text-3xl flex justify-center">ประวัติการรักษา</div>
        <!-- Medical history content here -->
      </div>
    </div>
  </UserLayout>
</template>

<script setup>
import ProfileAside from '~/components/user/ProfileAside.vue';
import UserLayout from '~/layouts/userLayouts.vue';
// other imports
</script>
