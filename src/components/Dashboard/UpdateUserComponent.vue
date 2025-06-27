<template>
  <div
    class="flex flex-col justify-center min-h-screen bg-gradient-to-r from-indigo-950 via- to-indigo-700"
  >
    <div class="relative py-3 max-w-6xl w-full mx-auto px-4">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
      <div
        class="relative px-6 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
      >
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">
          Search and Edit Users
        </h1>

        <!-- Search Input -->
        <div class="mb-6 relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search by username..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            @input="currentPage = 1"
          />
        </div>

        <!-- Results Table -->
        <div class="overflow-x-auto">
          <table
            v-if="paginatedUsers.length > 0"
            class="min-w-full divide-y divide-gray-200"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in [
                    'Username',
                    'Full Name',
                    'Designation',
                    'Prep Location',
                    'Role',
                    'BHC No',
                    'Action',
                  ]"
                  :key="header"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in paginatedUsers"
                :key="user.username"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ user.username }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ user.fullname }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    v-if="user.isEditing"
                    type="text"
                    v-model="user.designation"
                    class="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <span v-else>{{ user.designation }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    v-if="user.isEditing"
                    type="text"
                    v-model="user.prep_location"
                    class="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <span v-else>{{ user.prep_location }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    v-if="user.isEditing"
                    type="text"
                    v-model="user.role"
                    class="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <span v-else>{{ user.role }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    v-if="user.isEditing"
                    type="text"
                    v-model="user.bhc_no"
                    class="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <span v-else>{{ user.bhc_no }}</span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    v-if="!user.isEditing"
                    @click="toggleEdit(user)"
                    class="text-cyan-600 hover:text-cyan-900 mr-2 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <template v-else>
                    <button
                      @click="saveChanges(user)"
                      class="text-green-600 hover:text-green-900 mr-2 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit(user)"
                      class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </template>
                  <button
                    @click="requestDelete(user)"
                    class="text-red-600 hover:text-red-900 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-center text-gray-500 mt-4">
            No matching users found.
          </p>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredUsers.length > usersPerPage"
          class="mt-6 flex justify-center"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 mx-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-4 py-2 mx-1"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 mx-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <!-- Messages inside table container -->
        <div v-if="successMessage || errorMessage" class="mb-4 max-w-full">
          <div
            v-if="successMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md text-center mb-2"
          >
            {{ successMessage }}
          </div>
          <div
            v-if="errorMessage"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-md text-center"
          >
            {{ errorMessage }}
          </div>
        </div>

        <!-- Confirm delete message -->
        <div
          v-if="userToDelete"
          class="mb-6 max-w-full bg-gray-100 border border-gray-300 text-gray-800 px-6 py-4 rounded shadow-md text-center"
        >
          <p class="mb-4">
            Are you sure you want to delete user:
            <strong>{{ userToDelete.username }}</strong
            >? This cannot be undone.
          </p>
          <button
            @click="confirmDelete"
            class="bg-red-600 text-white px-4 py-2 rounded mr-4 hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
const API_PREFIX = import.meta.env.VITE_API_URL || "/api";

const users = ref([]);
const originalUsers = ref({});
const searchTerm = ref("");
const currentPage = ref(1);
const usersPerPage = ref(10);
const isLoading = ref(true);

// Message refs
const successMessage = ref("");
const errorMessage = ref("");

// For custom delete confirmation
const userToDelete = ref(null);

async function fetchUsers() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const response = await axios.post(API_PREFIX, { action: "getUsers" });
    const data = response.data;

    if (data.success && data.users && Array.isArray(data.users)) {
      users.value = data.users.map((user) => ({ ...user, isEditing: false }));
    } else {
      throw new Error(
        data.message || "Failed to fetch users or unexpected data format."
      );
    }
  } catch (error) {
    errorMessage.value = error.message;
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchUsers);

const toggleEdit = (user) => {
  if (!user.isEditing) {
    originalUsers.value[user.rowindex] = { ...user };
  }
  user.isEditing = !user.isEditing;
};

const cancelEdit = (user) => {
  if (originalUsers.value[user.rowindex]) {
    Object.assign(user, originalUsers.value[user.rowindex]);
    user.isEditing = false;
    delete originalUsers.value[user.rowindex];
  }
};

const saveChanges = async (user) => {
  successMessage.value = "";
  errorMessage.value = "";
  try {
    const response = await axios.post(API_PREFIX, {
      action: "updateUser",
      username: user.username,
      fullname: user.fullname,
      designation: user.designation,
      prep_location: user.prep_location,
      role: user.role,
      bhc_no: user.bhc_no,
      rowindex: user.rowindex,
    });

    if (response.data.success) {
      user.isEditing = false;
      delete originalUsers.value[user.rowindex];
      successMessage.value = "User updated successfully!";
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    } else {
      throw new Error(response.data.message || "Unknown error from server.");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    errorMessage.value = `Failed to save changes: ${error.message}`;
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
    cancelEdit(user);
  }
};

// New: On Delete button click, request confirmation
const requestDelete = (user) => {
  userToDelete.value = user;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  successMessage.value = "";
  errorMessage.value = "";
  try {
    const response = await axios.post(API_PREFIX, {
      action: "deleteUser",
      rowindex: userToDelete.value.rowindex,
    });

    if (response.data.success) {
      users.value = users.value.filter(
        (u) => u.rowindex !== userToDelete.value.rowindex
      );
      successMessage.value = "User deleted successfully!";
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    } else {
      throw new Error(response.data.message || "Unknown error from server.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    errorMessage.value = `Failed to delete user: ${error.message}`;
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  } finally {
    userToDelete.value = null; // Reset after action
  }
};

const cancelDelete = () => {
  userToDelete.value = null;
};

const filteredUsers = computed(() =>
  users.value.filter(
    (user) =>
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
      (user.fullname &&
        user.fullname.toLowerCase().includes(searchTerm.value.toLowerCase()))
  )
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage.value;
  return filteredUsers.value.slice(start, start + usersPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage.value) || 1;
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>
