<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar placeholder -->
    <nav class="bg-white shadow">
      <div id="navbar-container"></div>
    </nav>

    <div class="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Search bar -->
      <div class="mb-4">
        <div class="mt-1 relative rounded-md shadow-sm">
          <input type="text"
            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full p-4 sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter UID" v-model="searchTerm" @keypress.enter="handleSearch" />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button @click="handleSearch"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Modified Date of Referral Filter section with Download button -->
    <div class="mb-6 flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <label for="start-date" class="text-sm font-medium text-gray-700">Start Date:</label>
        <input type="date" id="start-date" v-model="startDateFilter"
          class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <div class="flex items-center space-x-2">
        <label for="end-date" class="text-sm font-medium text-gray-700">End Date:</label>
        <input type="date" id="end-date" v-model="endDateFilter"
          class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
      </div>
      <button @click="applyFilters"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Apply Filters
      </button>
      <button @click="downloadCSV"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Download CSV
      </button>
    </div>
      <!-- Status message -->
      <div class="mb-4 text-sm text-gray-600">
        {{ statusMessage }}
        <span v-if="filteredRows.length > 0" class="ml-2 font-semibold">Total entries: {{ filteredRows.length - 1
          }}</span>
      </div>

      <!-- Table -->
      <div id="data-container" class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table v-if="filteredRows.length > 0" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="(header, index) in filteredRows[0]" :key="index" scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                      <div class="flex flex-col">
                        <span class="whitespace-nowrap">{{ header }}</span>
                        <div v-if="header === 'Referral to PrEP site'">
                          <select v-model="prepSiteFilter" @change="applyFilters"
                            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-indigo-900 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">All</option>
                            <option v-for="option in prepSiteOptions" :key="option" :value="option">
                              {{ option }}
                            </option>
                          </select>

                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, rowIndex) in displayedRows" :key="rowIndex" class="hover:bg-gray-50">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                      :class="[highlightCondition(cell, cellIndex), 'px-6 py-4 whitespace-nowrap text-sm']"
                      :data-label="filteredRows[0][cellIndex]">
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="changePage(-1)" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button @click="changePage(1)" :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing page <span class="font-medium">{{ currentPage }}</span> of <span class="font-medium">{{ totalPages
                }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="changePage(-1)" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button @click="changePage(1)" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const searchTerm = ref('')
const statusMessage = ref('')
const sheetId = '2PACX-1vSfG6e5EIcHDaXopn9DxMZnTwVFGi5CiQxmKlEIPsd7uPtZiQIikYb46UdN78UhZlJfocCfl_s0hGGX'
const gid = '0'
const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv&gid=${gid}`
const allRows = ref([])
const filteredRows = ref([])
const rowsPerPage = 15
const currentPage = ref(1)
const prepSiteFilter = ref('')
const prepSiteOptions = ref([])
const startDateFilter = ref('')
const endDateFilter = ref('')
const userData = ref(null)

// Column indices for filtering
const COLUMN_INDICES = {
  UID: 1,  // Column A
  DATE_OF_REFERRAL: 4,  // Column C
  PREP_SITE: 3 // Column D - Correct column for "Referral to PrEP site"
}

const highlightConditions = {
  12: 'End of M1',
  14: 'END OF M3',
  16: 'END OF M6',
  18: 'END OF M9',
  20: 'END OF M12'
}

const highlightCondition = (value, columnIndex) => {
  const trimmedValue = value?.trim()?.toLowerCase() || ''
  if (trimmedValue === 'positive') {
    return 'bg-red-300 text-red-700'
  } else if (trimmedValue === 'negative') {
    return 'bg-green-400 text-green-600'
  }

  if (highlightConditions[columnIndex] === value?.trim()) {
    return 'bg-green-100 text-green-700'
  }

  return ''
}

const hasFullAccess = computed(() => {
  return ['admin', 'l1', 'l2'].includes(userData.value?.role?.toLowerCase())
})

const displayedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage
  return filteredRows.value.slice(startIndex + 1, startIndex + rowsPerPage + 1)
})

const totalPages = computed(() => {
  return Math.ceil((filteredRows.value.length - 1) / rowsPerPage)
})

const getUserData = () => {
  try {
    const data = localStorage.getItem('loggedInUser')
    if (data) {
      userData.value = JSON.parse(data)
    }
    return userData.value
  } catch (error) {
    console.error('Error reading user data:', error)
    return null
  }
}

const parseCsv = (csvText) => {
  return csvText.split('\n').map((row) => row.split(',').map(cell => cell.trim()))
}

const parseDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

const fetchSheetData = async () => {
  try {
    const user = getUserData()
    if (!user) {
      console.error('No user data found')
      return
    }

    const response = await axios.get(url)
    const csvText = response.data
    const parsedRows = parseCsv(csvText)

    // Find the correct column index for "Referral to PrEP site"
    const headerRow = parsedRows[0]
    const prepSiteColumnIndex = headerRow.findIndex(header =>
      header.trim().toLowerCase() === 'referral to prep site'
    )

    if (prepSiteColumnIndex !== -1) {
      COLUMN_INDICES.PREP_SITE = prepSiteColumnIndex
    }

    // Apply role-based filtering
    if (hasFullAccess.value) {
      allRows.value = parsedRows
    } else {
      allRows.value = [
        parsedRows[0],
        ...parsedRows.slice(1).filter(row =>
          row[COLUMN_INDICES.PREP_SITE] === user.prep_location
        )
      ]
    }

    filteredRows.value = allRows.value
    updatePrepSiteOptions()
    applyFilters()
  } catch (error) {
    console.error('Error fetching data:', error)
    document.getElementById('data-container').innerHTML = 'Error loading data. Please check the console for details.'
  }
}

const updatePrepSiteOptions = () => {
  if (!allRows.value.length) return

  if (hasFullAccess.value) {
    // Get unique PrEP site values from the data
    const uniqueValues = new Set(
      allRows.value
        .slice(1)
        .map(row => row[COLUMN_INDICES.PREP_SITE])
        .filter(Boolean) // Remove empty values
    )
    prepSiteOptions.value = Array.from(uniqueValues).sort()
  } else {
    // For non-admin users, only show their assigned location
    prepSiteOptions.value = userData.value?.prep_location ? [userData.value.prep_location] : []
    prepSiteFilter.value = userData.value?.prep_location || ''
  }
}

const applyFilters = () => {
  filteredRows.value = allRows.value.filter((row, index) => {
    if (index === 0) return true // Keep header row

    // 1. UID Filter
    const uidMatch = !searchTerm.value ||
                    row[COLUMN_INDICES.UID]?.toLowerCase().includes(searchTerm.value.toLowerCase())

    // 2. PrEP Site Filter
    let prepSiteMatch = true
    if (!hasFullAccess.value) {
      // For non-admin users, only show their assigned location
      prepSiteMatch = row[COLUMN_INDICES.PREP_SITE] === userData.value?.prep_location
    } else if (prepSiteFilter.value) {
      // For admin users, filter by selected PrEP site if one is selected
      prepSiteMatch = row[COLUMN_INDICES.PREP_SITE] === prepSiteFilter.value
    }

    // 3. Date Filter
    let dateMatch = true
    if (startDateFilter.value && endDateFilter.value) {
      const rowDate = parseDate(row[COLUMN_INDICES.DATE_OF_REFERRAL])
      const startDate = parseDate(startDateFilter.value)
      const endDate = parseDate(endDateFilter.value)

      if (rowDate && startDate && endDate) {
        // Set time to midnight for consistent comparison
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        dateMatch = rowDate >= startDate && rowDate <= endDate
      }
    }

    return uidMatch && prepSiteMatch && dateMatch
  })

  currentPage.value = 1
  updateStatusMessage()
}

const handleSearch = () => {
  applyFilters()
}

const changePage = direction => {
  const newPage = currentPage.value + direction
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
  }
}

const updateStatusMessage = () => {
  const count = filteredRows.value.length - 1
  statusMessage.value = count === 0 ? 'No matching records found' : `Found ${count} matching records`
}

const downloadCSV = () => {
  const csvContent = filteredRows.value.map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url

  const date = new Date().toISOString().slice(0, 10)
  link.setAttribute('download', `filtered_data_${date}.csv`)

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchSheetData()
})
</script>
<style scoped>
.table-wrapper {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th {
  background: linear-gradient(135deg, #2f3083, #3636a5); /* From primary color to a lighter shade */
  border: 1px solid #333232;
  color: #fff;
  font-size: 20px;
  text-align: left; /* Add alignment if needed */
  padding: 10px; /* Adjust spacing for readability */
}


td {
  border: 1px solid #333232;
}

.hover\:bg-gray-100:hover {
  background-color: #f7f7f7;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-700 {
  color: #b91c1c;
}

.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-700 {
  color: #047857;
}

.bg-blue-100 {
  background-color: #e0f2fe;
}
</style>
