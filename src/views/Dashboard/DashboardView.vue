<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar ref="sidebar" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="bg-white shadow-sm lg:hidden">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <button @click="toggleSidebar" class="text-gray-500 focus:outline-none focus:text-gray-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Main content area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="flex flex-col h-full max-w-8xl mx-auto px-6 py-8">
          <!-- Dynamically render components based on route -->
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Navigation/SideNavBarComponent.vue'

const sidebar = ref(null)

const toggleSidebar = () => {
  sidebar.value.toggleSidebar()
}
</script>
