<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderComponent from './components/Common/HeaderComponent.vue'
import FooterComponent from './components/Common/FooterComponent.vue'

const showHeaderFooter = ref(true)

const route = useRoute()

onMounted(() => {
  showHeaderFooter.value = !route.path.includes('dashboard')
})

watch(() => route.path, (newPath) => {
  showHeaderFooter.value = !newPath.includes('dashboard')
})

</script>

<template>
  <HeaderComponent v-if="showHeaderFooter" />
  <RouterView />
  <FooterComponent v-if="showHeaderFooter" />
</template>

