<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100"
  >
    <div class="relative w-full max-w-md mx-auto px-4">
      <!-- Skewed background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>

      <!-- Login form container -->
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-10">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- Username Input -->
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700"
                >Username</label
              >
              <input
                id="username"
                name="username"
                type="text"
                v-model="username"
                autocomplete="username"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <input
                id="password"
                name="password"
                type="password"
                v-model="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900"
                >Remember me</label
              >
            </div>
            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500"
                >Forgot your password?</a
              >
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";

  try {
    const response = await axios.post("/api", {
      action: "login",
      username: username.value.trim(),
      password: password.value.trim(),
    });

    const data = response.data;

    if (data.success) {
      // Save user info from backend response
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      Swal.fire({
        title: "Success!",
        text: "Login successful! Redirecting...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false,
        willClose: () => {
          if (data.user.role === "L4") {
            window.location.href = "/dashboard/forms";
          } else {
            window.location.href = "/dashboard";
          }
        },
      });
    } else {
      errorMessage.value = data.message || "Invalid username or password.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Server error. Please try again later.";
  }
};
</script>
