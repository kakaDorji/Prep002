<template>
  <footer class="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="grid grid-cols-2 gap-8 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-blue-300 tracking-wider uppercase">Quick Links</h3>
              <ul class="mt-4 space-y-4">
                <li v-for="link in quickLinks" :key="link.name">
                  <a :href="link.href" class="text-base text-gray-300 hover:text-white transition-colors duration-200">
                    {{ link.name }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-blue-300 tracking-wider uppercase">Resources</h3>
              <ul class="mt-4 space-y-4">
                <li v-for="link in resourceLinks" :key="link.name">
                  <a :href="link.href" class="text-base text-gray-300 hover:text-white transition-colors duration-200">
                    {{ link.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-8 xl:mt-0">
          <h3 class="text-sm font-semibold text-blue-300 tracking-wider uppercase">Subscribe to our newsletter</h3>
          <p class="mt-4 text-base text-gray-300">Stay updated with the latest information about PrEP in Bhutan.</p>
          <form @submit.prevent="subscribeToNewsletter" class="mt-4 sm:flex sm:max-w-md">
            <label for="email-address" class="sr-only">Email address</label>
            <input v-model="email" type="email" name="email-address" id="email-address" autocomplete="email" required
              class="appearance-none min-w-0 w-full bg-slate-700 border border-transparent rounded-md py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your email">
            <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-base text-gray-400">
          &copy; {{ new Date().getFullYear() }} Druk PrEP. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const quickLinks = [
  { name: 'Home', href: '#' },
  { name: 'About PrEP', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Get Started', href: '#get-started' },
];

const resourceLinks = [
  { name: 'FAQ', href: '#faq' },
  { name: 'PrEP Guidelines', href: '#guidelines' },
  { name: 'HIV Information', href: '#hiv-info' },
  { name: 'Contact Us', href: '#contact' },
];

const subscribeToNewsletter = () => {
  console.log('Subscribing email:', email.value)
  email.value = ''
}
</script>
