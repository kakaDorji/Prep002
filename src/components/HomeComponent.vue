<template>
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img :src="landinBg" alt="PrEP Bhutan Hero" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-white text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h1 class="text-5xl sm:text-6xl font-bold mb-6">PrEP Bhutan</h1>
      <p class="text-xl sm:text-2xl mb-8 leading-relaxed">
        Pre-exposure prophylaxis, or PrEP, is taking ARV medication by HIV-negative people before a potential exposure
        to HIV to prevent HIV acquisition. If PrEP is taken as prescribed it is a powerful medication that offers strong
        protection against HIV. Taking PrEP is a responsible step one can take to safeguard your health, the health of
        your near and dear ones and by doing so contribute towards the reduction of burden of HIV infections in our
        country.
      </p>
      <button @click="getStarted"
        class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105">
        Get Started
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import landinBg from '@/assets/img/landingpage.jpg';

const router = useRouter();

const getStarted = () => {
  router.push('/login');
};
</script>

