<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <!-- Overlay for mobile -->
    <div v-if="isOpen" @click="toggleSidebar"
      class="fixed inset-0 z-20 transition-opacity bg-gray-900 bg-opacity-75 lg:hidden"></div>

    <!-- Sidebar -->
    <div
      :class="[isOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 z-30 w-72 transition duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0']">
      <div class="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl rounded-r-xl">
        <!-- Logo -->
        <div class="flex items-center justify-center h-20 bg-gradient-to-r from-blue-900 to-indigo-900">
          <span class="text-2xl font-bold text-white">PrEP Bhutan</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <template v-for="item in filteredMenuItems" :key="item.name">
            <!-- Regular menu item -->
            <router-link v-if="!item.subMenu" :to="item.route"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out"
              :class="[isRouteActive(item.route) ? 'bg-blue-900 bg-opacity-50 text-white' : 'text-gray-300 hover:bg-blue-800 hover:bg-opacity-25 hover:text-white']">
              <component :is="item.icon" class="mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200"
                :class="isRouteActive(item.route) ? 'text-blue-300' : 'text-gray-400 group-hover:text-blue-300'"
                aria-hidden="true" />
              {{ item.name }}
            </router-link>

            <!-- Menu item with sub-menu -->
            <div v-else class="space-y-1">
              <button @click="toggleSubMenu(item.name)"
                class="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out"
                :class="[isSubMenuOpen(item.name) ? 'bg-blue-900 bg-opacity-50 text-white' : 'text-gray-300 hover:bg-blue-800 hover:bg-opacity-25 hover:text-white']">
                <div class="flex items-center">
                  <component :is="item.icon" class="mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200"
                    :class="isSubMenuOpen(item.name) ? 'text-blue-300' : 'text-gray-400 group-hover:text-blue-300'"
                    aria-hidden="true" />
                  {{ item.name }}
                </div>
                <ChevronDownIcon class="ml-auto h-4 w-4 transform transition-transform duration-200"
                  :class="{ 'rotate-180': isSubMenuOpen(item.name) }" />
              </button>
              <transition enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-show="isSubMenuOpen(item.name)" class="mt-1 space-y-1 pl-10">
                  <router-link v-for="subItem in item.filteredSubMenu || item.subMenu" :key="subItem.name" :to="subItem.route"
                    class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ease-in-out"
                    :class="[isRouteActive(subItem.route) ? 'bg-blue-900 bg-opacity-50 text-white' : 'text-gray-400 hover:bg-blue-800 hover:bg-opacity-25 hover:text-white']">
                    {{ subItem.name }}
                  </router-link>
                </div>
              </transition>
            </div>
          </template>
        </nav>

        <!-- Logout button -->
        <div class="p-4 border-t border-gray-700">
          <button @click="logout"
            class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg hover:from-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out">
            <ArrowRightOnRectangleIcon class="w-5 h-5 mr-2" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import {
  HomeIcon, ChartBarIcon, DocumentTextIcon,
  PresentationChartLineIcon, CogIcon, TableCellsIcon,
  ArrowRightOnRectangleIcon, ChevronDownIcon
} from '@heroicons/vue/24/outline'

const isOpen = ref(false)
const openSubMenus = reactive({})
const router = useRouter()
const loggedInUser = ref(null)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const toggleSubMenu = (menuName) => {
  openSubMenus[menuName] = !openSubMenus[menuName]
}

const isSubMenuOpen = (menuName) => {
  return openSubMenus[menuName] || false
}

const route = useRoute()
const isRouteActive = (itemRoute) => {
  return route.path === itemRoute || route.path.startsWith(itemRoute)
}

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, route: '/dashboard', roles: ['admin', 'L1', 'L2', 'L3'] },
  { name: 'Stats', icon: ChartBarIcon, route: '/dashboard/stats', roles: ['admin', 'L1', 'L2', 'L3'] },
  { name: 'Forms', icon: DocumentTextIcon, route: '/dashboard/forms', roles: ['admin', 'L2', 'L3', 'L4'] },
  {
    name: 'Analytics',
    icon: PresentationChartLineIcon,
    roles: ['admin', 'L2', 'L3'],
    subMenu: [
      { name: 'Monitor View Analytics', route: '/dashboard/analytics/monitorview', roles: ['admin', 'L1', 'L4'] },
      { name: 'Unscheduled Analytics', route: '/dashboard/analytics/unscheduleanalytics', roles: ['admin', 'L2', 'L3'] },
    ],
  },
  {
    name: 'Settings',
    icon: CogIcon,
    roles: ['admin'],
    subMenu: [
      { name: 'Add User', route: '/dashboard/settings/add-user', roles: ['admin'] },
      { name: 'Update User Details', route: '/dashboard/settings/update-user', roles: ['admin'] },
    ],
  },
]

// Filter main and submenu items based on role
const filteredMenuItems = computed(() => {
  if (!loggedInUser.value) return []

  // console.log("Current logged-in user role:", loggedInUser.value.role) // Debugging: Log user role
  return menuItems
    .filter(item => {
      const hasAccess = item.roles.includes(loggedInUser.value.role)
      // console.log(`Checking main menu item: ${item.name} | User has access: ${hasAccess}`) // Debugging
      return hasAccess
    })
    .map(item => {
      if (item.subMenu) {
        item.filteredSubMenu = item.subMenu.filter(subItem => {
          const hasSubAccess = subItem.roles ? subItem.roles.includes(loggedInUser.value.role) : true
          // console.log(`Checking submenu item: ${subItem.name} | User has access: ${hasSubAccess}`) // Debugging
          return hasSubAccess
        })
      }
      return item
    })
})

onMounted(() => {
  const userDataString = localStorage.getItem('loggedInUser')
  if (userDataString) {
    loggedInUser.value = JSON.parse(userDataString)
    // console.log("User loaded on mount:", loggedInUser.value) // Debugging: Confirm user data
  } else {
    console.log("No user found in localStorage.")
  }
})

// SweetAlert for logout and redirection
const logout = () => {
  Swal.fire({
    title: 'Logged out!',
    text: 'You will be redirected to the login page.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    willClose: () => {
      localStorage.removeItem('loggedInUser')
      router.push('/login')
    }
  })
}
</script>
