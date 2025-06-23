<template>
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
      <p class="text-3xl font-bold text-blue-600">{{ value }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  })
  </script>