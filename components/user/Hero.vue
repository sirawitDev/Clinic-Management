<script setup>

</script>

<template>
    <div class="hero h-screen rounded-lg"
        style="background-image: url(https://img.freepik.com/free-photo/blur-hospital_1203-7972.jpg?t=st=1719026335~exp=1719029935~hmac=e7e875465af8178b6aaa99946fe20441f051ce12c3a5882b06556b56fbaffb79&w=826);">
        <div class="hero-overlay bg-opacity-10 rounded-lg"></div>
        <div class="hero-content text-center text-neutral-content">
            <div
                class="flex flex-col bg-[#FF791A] rounded-lg h-72 w-11/12 md:w-[500px] bg-opacity-50 justify-between items-center mx-auto">
                <div class="mt-7">
                    <div class="mb-5 text-3xl md:text-5xl font-bold text-white">
                        Yourname
                    </div>
                </div>
                <div class="mb-5 text-center">
                    <p class="text-white text-sm md:text-base">Your Description.</p>
                </div>
                <div class="flex flex-col my-5">
                    <div>
                        <div
                            class="btn bg-orange-500 hover:-translate-y-1 rounded-md shadow-md hover:shadow-lg active:shadow-inner h-14 w-48 hover:bg-slate-50 hover:bg-opacity-50"
                            role="button">
                            <span class="relative z-10 text-white font-light text-lg">จองคิวออนไลน์</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overflow-auto {
    overflow-y: auto;
}
</style>