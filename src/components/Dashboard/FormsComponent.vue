<template>
  <div class="bg-gradient-to-br from-indigo-900 to-blue-300  mb-20px p-6 font-sans">
    <!-- Title -->
    <h1 class="text-4xl font-bold mb-8 text-gray-100 text-center">PrEP Forms</h1>

    <!-- Main Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="(card, index) in mainCards" :key="index" :class="{ 'md:col-span-2 md:row-span-2': card.isJumbo }">
        <div
          class="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
          @click="openModal(card)">
          <!-- Card Header with Gradient -->
          <div class="bg-gradient-to-r from-indigo-900 to-blue-800 text-white p-6">
            <h3 class="text-xl font-semibold">{{ card.title }}</h3>
          </div>
          <!-- Card Content -->
          <div class="p-6 flex-grow">
            <p class="text-sm text-gray-600">{{ card.description }}</p>
          </div>
          <!-- Button Section -->
          <div class="bg-gray-50 p-4">
            <button
              class="w-full py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105">
              Fill Up
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Resources Section -->
    <div class="mt-8 pb-10" v-if="additionalCards.length > 0">
      <h2 class="text-3xl font-semibold mb-6 text-white text-center">Additional Resources</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(card, index) in additionalCards" :key="index">
          <div
            class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            @click="openModal(card)">
            <!-- Gradient for Additional Cards -->
            <div class="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6">
              <h3 class="text-xl font-semibold">{{ card.title }}</h3>
            </div>
            <div class="p-6">
              <p class="text-sm text-gray-600">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <TransitionRoot appear :show="isModalOpen" as="div">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  {{ selectedCard.title }}
                </DialogTitle>

                <!-- Dynamic form component rendering -->
                <component :is="selectedComponent" v-if="selectedComponent"></component>

                <!-- Modal controls -->
                <div class="mt-6">
                  <button type="button"
                    class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105"
                    @click="closeModal">
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useRouter } from 'vue-router';

// Card data
const allMainCards = [
  { title: "ORW FIELD FORMAT", description: "Manage outreach worker field data for PrEP mobilization." },
  { title: "CLINICAL DATA FORM", description: "Record and manage clinical data for PrEP patients." },
  { title: "BASELINE BEHAVIOUR TOOL", description: "Assess baseline behaviors for PrEP clients." },
  { title: "SUITABILITY ASSESSMENT", description: "SUITABILITY ASSESSMENT FOR ENROLMENT.", isJumbo: false },
  { title: "DRUG DISTRIBUTION", description: "Track individual client drug distribution for PrEP." },
  { title: "FOLLOW-UP TOOL", description: "Track and manage follow-up appointments for PrEP clients." },
  { title: "UNSCHEDULED VISIT", description: "Handle unscheduled visits for PrEP patients." },
  { title: "EXIT", description: "Process client exits from the PrEP program." },
  { title: "SEROCONVERSION", description: "Report and manage oral PrEP seroconversion cases." },
];

const allAdditionalCards = [
  { title: "MONITORING VIEW", description: "Comprehensive view of all ORW Field Format data for PrEP mobilization.", isJumbo: true },
  { title: "LAB TEST", description: "Manage and track laboratory tests for PrEP clients." },
];

const mainCards = ref([]);
const additionalCards = ref([]);

const isModalOpen = ref(false);
const selectedCard = ref({});
const selectedComponent = ref(null);
const router = useRouter();

// Function to dynamically load form components
const loadComponent = async (card) => {
  switch (card.title) {
    case 'SUITABILITY ASSESSMENT':
      selectedComponent.value = (await import('@/components/Forms/Form1.vue')).default;
      break;
    case 'BASELINE BEHAVIOUR TOOL':
      selectedComponent.value = (await import('@/components/Forms/Form2.vue')).default;
      break;
    case 'CLINICAL DATA FORM':
      selectedComponent.value = (await import('@/components/Forms/Form3.vue')).default;
      break;
    case 'FOLLOW-UP TOOL':
      selectedComponent.value = (await import('@/components/Forms/Form4.vue')).default;
      break;
    case 'UNSCHEDULED VISIT':
      selectedComponent.value = (await import('@/components/Forms/Form5.vue')).default;
      break;
    case 'EXIT':
      selectedComponent.value = (await import('@/components/Forms/Form6.vue')).default;
      break;
    case 'SEROCONVERSION':
      selectedComponent.value = (await import('@/components/Forms/Form8.vue')).default;
      break;
    case 'DRUG DISTRIBUTION':
      selectedComponent.value = (await import('@/components/Forms/Form9.vue')).default;
      break;
    case 'ORW FIELD FORMAT':
      selectedComponent.value = (await import('@/components/Forms/From10.vue')).default; // Corrected the typo
      break;
    case 'LAB TEST':
      selectedComponent.value = (await import('@/components/Forms/LabTest.vue')).default;
      break;
    default:
      selectedComponent.value = null;
      break;
  }
};

// Modal functions
const openModal = async (card) => {
  if (card.title === 'MONITORING VIEW') {
    router.push('/dashboard/analytics/monitorview');  // Redirect for "MONITORING VIEW"
  } else {
    await loadComponent(card);
    selectedCard.value = card;
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Fetch the logged-in user's role from localStorage and filter cards accordingly
onMounted(() => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (loggedInUser && loggedInUser.role === 'L4') {
    // If the user is L4, only show "ORW FIELD FORMAT" and "MONITORING VIEW"
    mainCards.value = allMainCards.filter(card => card.title === 'ORW FIELD FORMAT');
    additionalCards.value = allAdditionalCards.filter(card => card.title === 'MONITORING VIEW');
  } else {
    // For other roles, show all cards
    mainCards.value = allMainCards;
    additionalCards.value = allAdditionalCards;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
</style>
