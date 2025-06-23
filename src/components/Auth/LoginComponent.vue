<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
    <div class="relative w-full max-w-md mx-auto px-4">
      <!-- Skewed background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
      </div>

      <!-- Login form container -->
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-10">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p class="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- Username Input -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input id="username" name="username" type="text" v-model="username" autocomplete="username" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username" />
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" v-model="password" autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password" />
            </div>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLmQK8P5bNosSrojHGpYtT-91GO812x5tSjR_RgpBWPvhibuU-CKOVYah1p9k9dpXcGqDm0MznbnkM/pub?gid=0&single=true&output=csv'

const sheetId = '2PACX-1vQLmQK8P5bNosSrojHGpYtT-91GO812x5tSjR_RgpBWPvhibuU-CKOVYah1p9k9dpXcGqDm0MznbnkM'
const gid = '0'
const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`

const users = ref([])

const fetchUsersFromCSV = async () => {
  try {
    const response = await fetch(url)
    const csvText = await response.text()
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')

    const parsedUsers = await Promise.all(
      lines.slice(1).map(async (line) => {
        const values = line.split(',')
        const user = {}
        headers.forEach((header, index) => {
          user[header.trim().toLowerCase()] = values[index].trim()
        })

        return {
          username: user.username,
          password: await hashPassword(user.password),
          prep_location: user.prep_location,
          fullname: user.fullname,
          designation: user.designation,
          bhc_no: user.bhc_no,
          role: user.role,
        }
      })
    )

    users.value = parsedUsers
    localStorage.setItem('users', JSON.stringify(parsedUsers))
  } catch (error) {
    console.error('Error fetching users:', error)
    errorMessage.value = 'Error loading user data.'
  }
}

const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

fetchUsersFromCSV()

const handleSubmit = async () => {
  const storedUsers = users.value || JSON.parse(localStorage.getItem('users'))
  const user = storedUsers.find(u => u.username === username.value)

  if (user) {
    const hashedPassword = await hashPassword(password.value)
    if (hashedPassword === user.password) {
      // Save user details to localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({
        username: user.username,
        role: user.role,
        fullname: user.fullname,
        bhcno: user.bhc_no,
        designation: user.designation,
        prep_location: user.prep_location
      }))

      // Check the role and redirect accordingly
      if (user.role === 'L4') {
        Swal.fire({
          title: 'Success!',
          text: 'Login successful! Redirecting to forms...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false,
          willClose: () => {
            window.location.href = '/dashboard/forms'  // Redirect for L4 role
          }
        })
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'Login successful! Redirecting to dashboard...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false,
          willClose: () => {
            window.location.href = '/dashboard'  // Redirect for other roles
          }
        })
      }
    } else {
      errorMessage.value = 'Invalid username or password.'
    }
  } else {
    errorMessage.value = 'User not found.'
  }
}

</script>
